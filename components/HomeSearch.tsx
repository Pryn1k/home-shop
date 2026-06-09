"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(
      query ? `/products?search=${encodeURIComponent(query)}` : "/products"
    );
  };

  return (
    <form
      onSubmit={submit}
      className="mt-8 flex w-full max-w-md items-center gap-2"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск товаров..."
        className="flex-1 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-white placeholder-white/60 backdrop-blur focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-accent px-5 py-2 font-medium text-neutral-900 transition hover:opacity-90"
      >
        Найти
      </button>
    </form>
  );
}
