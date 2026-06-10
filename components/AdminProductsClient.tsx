"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import ProductForm from "./ProductForm";

export default function AdminProductsClient({
  products,
}: {
  products: Product[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const shown = query
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.category ?? "").toLowerCase().includes(query)
      )
    : products;

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить товар «${title}»?`)) return;

    setDeletingId(id);
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию или категории…"
          className="w-full rounded-lg border p-2"
        />
      </div>

      <div className="flex flex-col gap-3">
        {products.length === 0 && (
          <p className="text-neutral-400">Товаров пока нет.</p>
        )}

        {products.length > 0 && shown.length === 0 && (
          <p className="text-neutral-400">Ничего не найдено.</p>
        )}

        {shown.map((p) => {
          const hasDiscount = p.oldPrice != null && p.oldPrice > p.price;

          return (
            <div
              key={p.id}
              className="flex items-center gap-4 border rounded-xl p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.title}
                className="h-16 w-16 rounded-lg object-cover bg-neutral-800"
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{p.title}</p>
                <p className="text-sm">
                  <span className="text-accent">{p.price} грн</span>
                  {hasDiscount && (
                    <span className="ml-2 text-neutral-400 line-through">
                      {p.oldPrice} грн
                    </span>
                  )}
                  {p.stock != null && (
                    <span
                      className={`ml-2 text-xs ${
                        p.stock === 0 ? "text-red-400" : "text-neutral-400"
                      }`}
                    >
                      {p.stock === 0 ? "нет в наличии" : `в наличии: ${p.stock}`}
                    </span>
                  )}
                </p>
              </div>

              <button
                onClick={() => setEditing(p)}
                className="rounded border px-3 py-1.5 text-sm transition hover:bg-white/10"
              >
                Редактировать
              </button>

              <button
                onClick={() => handleDelete(p.id, p.title)}
                disabled={deletingId === p.id}
                className="rounded border border-red-500/60 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                {deletingId === p.id ? "Удаление..." : "Удалить"}
              </button>
            </div>
          );
        })}
      </div>

      {/* МОДАЛКА РЕДАКТИРОВАНИЯ */}
      {editing && (
        <div
          onClick={() => setEditing(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 text-gray-900 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Редактировать товар</h2>
              <button
                onClick={() => setEditing(null)}
                aria-label="Закрыть"
                className="text-2xl leading-none text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            <ProductForm
              mode="edit"
              product={editing}
              onDone={() => setEditing(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
