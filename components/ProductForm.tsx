"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";

type Slot =
  | { id: number; kind: "url"; url: string }
  | { id: number; kind: "file"; file: File; preview: string };

export default function ProductForm({
  mode,
  product,
  onDone,
}: {
  mode: "add" | "edit";
  product?: Product;
  onDone: () => void;
}) {
  const router = useRouter();
  const addInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);
  const replaceTargetId = useRef<number | null>(null);

  const nextId = () => ++idCounter.current;

  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [oldPrice, setOldPrice] = useState(
    product?.oldPrice != null ? String(product.oldPrice) : ""
  );
  const [category, setCategory] = useState(product?.category ?? "");
  const [categories, setCategories] = useState<string[]>([]);
  const [stock, setStock] = useState(
    product?.stock != null ? String(product.stock) : ""
  );
  const [slots, setSlots] = useState<Slot[]>(() => {
    const urls = product?.images?.length
      ? product.images
      : product?.image
      ? [product.image]
      : [];
    return urls.map((url) => ({ id: ++idCounter.current, kind: "url", url }));
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // подгружаем список категорий из БД
  useEffect(() => {
    let active = true;
    fetch("/api/categories", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const list: string[] = data.categories ?? [];
        setCategories(list);
        // в режиме добавления выбираем первую категорию по умолчанию
        setCategory((cur) => cur || list[0] || "");
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // освобождаем временные ссылки на превью при закрытии
  useEffect(() => {
    return () => {
      slots.forEach((s) => {
        if (s.kind === "file") URL.revokeObjectURL(s.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    const added: Slot[] = Array.from(files).map((file) => ({
      id: nextId(),
      kind: "file",
      file,
      preview: URL.createObjectURL(file),
    }));
    setSlots((prev) => [...prev, ...added]);
  };

  const replaceSlot = (file: File | null) => {
    const targetId = replaceTargetId.current;
    replaceTargetId.current = null;
    if (!file || targetId == null) return;
    setError("");
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== targetId) return s;
        if (s.kind === "file") URL.revokeObjectURL(s.preview);
        return {
          id: s.id,
          kind: "file",
          file,
          preview: URL.createObjectURL(file),
        };
      })
    );
  };

  const removeSlot = (id: number) => {
    setSlots((prev) => {
      const s = prev.find((x) => x.id === id);
      if (s && s.kind === "file") URL.revokeObjectURL(s.preview);
      return prev.filter((x) => x.id !== id);
    });
  };

  const triggerReplace = (id: number) => {
    replaceTargetId.current = id;
    replaceInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (slots.length === 0) {
      setError("Добавьте хотя бы одно фото");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("oldPrice", oldPrice);
    formData.append("category", category);
    formData.append("stock", stock);

    // порядок фото + новые файлы
    const order: Array<{ k: "url" | "new"; v: string | number }> = [];
    let fileIndex = 0;
    for (const s of slots) {
      if (s.kind === "url") {
        order.push({ k: "url", v: s.url });
      } else {
        formData.append("newImages", s.file);
        order.push({ k: "new", v: fileIndex });
        fileIndex++;
      }
    }
    formData.append("imagesOrder", JSON.stringify(order));

    const endpoint =
      mode === "add"
        ? "/api/admin/products"
        : `/api/admin/products/${product!.id}`;
    const method = mode === "add" ? "POST" : "PATCH";

    try {
      const res = await fetch(endpoint, { method, body: formData });
      const data = await res.json();

      if (data.success) {
        router.refresh();
        onDone();
      } else {
        setError(data.error || "Не удалось сохранить");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* МЕНЕДЖЕР КАРТИНОК */}
      <div>
        <p className="mb-1 text-sm text-gray-600">
          Фото (первое — обложка). Клик по фото — заменить, × — удалить.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((s, i) => (
            <div
              key={s.id}
              className="relative aspect-square overflow-hidden rounded-lg border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.kind === "url" ? s.url : s.preview}
                alt=""
                onClick={() => triggerReplace(s.id)}
                className="h-full w-full cursor-pointer object-cover"
              />

              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                  обложка
                </span>
              )}

              <button
                type="button"
                onClick={() => removeSlot(s.id)}
                aria-label="Удалить фото"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-sm leading-none text-white hover:bg-black/80"
              >
                ×
              </button>
            </div>
          ))}

          {/* плитка добавления */}
          <button
            type="button"
            onClick={() => addInputRef.current?.click()}
            aria-label="Добавить фото"
            className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-3xl text-gray-400 transition hover:border-gray-400 hover:text-gray-600"
          >
            +
          </button>
        </div>

        <input
          ref={addInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            replaceSlot(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </div>

      <input
        className="border p-2 rounded"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="border p-2 rounded min-h-[90px] resize-y"
        placeholder="Описание (материал, размеры, особенности — необязательно)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={2000}
      />

      <input
        className="border p-2 rounded"
        type="number"
        placeholder="Цена, грн"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <input
        className="border p-2 rounded"
        type="number"
        placeholder="Старая цена (для скидки, необязательно)"
        value={oldPrice}
        onChange={(e) => setOldPrice(e.target.value)}
      />

      <select
        className="border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.length === 0 && <option value="">Нет категорий</option>}
        {/* если у товара категория, которой уже нет в списке — всё равно показываем */}
        {category && !categories.includes(category) && (
          <option value={category}>{category}</option>
        )}
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input
        className="border p-2 rounded"
        type="number"
        min="0"
        placeholder="Количество в наличии (пусто = без ограничения)"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-neutral-900 font-bold py-2 rounded transition hover:opacity-90 disabled:opacity-60"
      >
        {loading
          ? "Сохранение..."
          : mode === "add"
          ? "Сохранить"
          : "Сохранить изменения"}
      </button>
    </form>
  );
}
