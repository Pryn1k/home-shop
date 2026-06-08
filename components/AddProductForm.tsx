"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductForm({
  onDone,
}: {
  onDone: () => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("phones");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // чистим временную ссылку на превью, когда компонент закрывается
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const openPicker = () => fileInputRef.current?.click();

  const handleFile = (f: File | null) => {
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Добавьте фото товара");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", file);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        router.refresh(); // обновляем списки товаров на сайте
        onDone(); // закрываем модалку
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

          {/* рамка с плюсиком: на мобиле всегда видна, на десктопе — при наведении.
              inset-[10px] = отступ 10px внутри картинки */}
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

      <select
        className="border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="phones">Телефоны</option>
        <option value="tv">TV</option>
      </select>

      {/* настоящий input прячем, кликаем по нему через кнопку ниже */}
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {/* кнопка выбора фото: зелёная после загрузки */}
      <button
        type="button"
        onClick={openPicker}
        className={`rounded border-2 p-2 transition ${
          file
            ? "border-green-500 text-green-600"
            : "border-gray-300 text-gray-700 hover:border-gray-400"
        }`}
      >
        {file ? "✓ Картинка загружена" : "Выбрать фото"}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-neutral-900 font-medium py-2 rounded transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  );
}
