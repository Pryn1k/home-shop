"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [oldPrice, setOldPrice] = useState(
    product?.oldPrice != null ? String(product.oldPrice) : ""
  );
  const [category, setCategory] = useState(product?.category ?? "phones");
  const [file, setFile] = useState<File | null>(null);
  // при редактировании сразу показываем текущее фото товара
  const [preview, setPreview] = useState(product?.image ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // чистим временную ссылку на превью (только для выбранного файла, не для http-ссылки)
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const openPicker = () => fileInputRef.current?.click();

  const handleFile = (f: File | null) => {
    setError("");
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : product?.image ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // фото обязательно только при добавлении; при редактировании можно оставить старое
    if (mode === "add" && !file) {
      setError("Добавьте фото товара");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    // старую цену шлём всегда: пусто = убрать скидку
    formData.append("oldPrice", oldPrice);
    formData.append("category", category);
    if (file) formData.append("image", file);

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

  const fileButtonText = file
    ? "✓ Картинка загружена"
    : mode === "edit"
    ? "Заменить фото"
    : "Выбрать фото";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* ПРЕВЬЮ КАРТИНКИ — сверху над всеми инпутами */}
      {preview && (
        <button
          type="button"
          onClick={openPicker}
          aria-label="Заменить фото"
          className="group relative block w-full aspect-video overflow-hidden rounded-lg"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Превью товара"
            className="h-full w-full object-cover"
          />

          <span className="pointer-events-none absolute inset-[10px] flex items-center justify-center rounded-md border-2 border-dashed border-white/80 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-2xl leading-none text-white">
              +
            </span>
          </span>
        </button>
      )}

      <input
        className="border p-2 rounded"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
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
        <option value="phones">Телефоны</option>
        <option value="tv">TV</option>
      </select>

      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        onClick={openPicker}
        className={`rounded border-2 p-2 transition ${
          file
            ? "border-green-500 text-green-600"
            : "border-gray-300 text-gray-700 hover:border-gray-400"
        }`}
      >
        {fileButtonText}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-neutral-900 font-medium py-2 rounded transition hover:opacity-90 disabled:opacity-60"
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
