"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductForm({
  onDone,
}: {
  onDone: () => void;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("phones");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      <input
        className="border p-2 rounded"
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        required
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white py-2 rounded disabled:opacity-60"
      >
        {loading ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  );
}
