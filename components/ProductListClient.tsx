"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";

type Product = {
  id: string;
  title: string;
  price: number;
  oldPrice: number | null;
  image: string;
  category: string;
  stock: number | null;
  createdAt: string;
};

type Props = {
  products: Product[];
};

export default function ProductListClient({ products }: Props) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("new");

  const filtered = products.filter((p) => {
    const matchSearch = p.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "all" || p.category === category;

    return matchSearch && matchCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "cheap") return a.price - b.price;
    if (sort === "expensive") return b.price - a.price;
    return 0; // "new" — товары уже идут новыми сверху
  });

  return (
    <div>

      {/* ФИЛЬТРЫ */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="border p-2 rounded flex-1 min-w-[180px]"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">Все категории</option>
          <option value="phones">Телефоны</option>
          <option value="tv">TV</option>
        </select>

        <select
          className="border p-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">Сначала новые</option>
          <option value="cheap">Сначала дешёвые</option>
          <option value="expensive">Сначала дорогие</option>
        </select>
      </div>

      {/* ТОВАРЫ */}
      {sorted.length === 0 ? (
        <p className="text-neutral-400">Ничего не найдено.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sorted.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      )}

    </div>
  );
}
