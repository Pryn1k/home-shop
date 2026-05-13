"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
};

type Props = {
  products: Product[];
};

export default function ProductListClient({ products }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = products.filter((p) => {
    const matchSearch = p.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "all" || p.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <div>

      {/* ФИЛЬТРЫ */}
      <div className="flex gap-4 mb-6">
        <input
          className="border p-2"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">Все</option>
          <option value="phones">Телефоны</option>
          <option value="tv">TV</option>
        </select>
      </div>

      {/* ТОВАРЫ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <ProductCard key={item.id} {...item} />
        ))}
      </div>

    </div>
  );
}