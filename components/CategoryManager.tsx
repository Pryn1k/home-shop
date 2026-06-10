"use client";

import { useEffect, useState } from "react";

export default function CategoryManager() {
  const [categories, setCategories] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      const data = await res.json();
      setCategories(data.categories ?? []);
    } catch {
      setError("Не удалось загрузить категории");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;

    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clean }),
      });
      const data = await res.json();
      if (data.success) {
        setName("");
        await load();
      } else {
        setError(data.error || "Не удалось добавить");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (cat: string) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cat }),
      });
      const data = await res.json();
      if (data.success) {
        await load();
      } else {
        setError(data.error || "Не удалось удалить");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Добавление */}
      <form onSubmit={add} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Новая категория"
          className="flex-1 rounded-lg border p-2"
        />
        <button
          type="submit"
          disabled={busy || !name.trim()}
          aria-label="Добавить категорию"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-xl font-bold text-neutral-900 transition hover:opacity-90 disabled:opacity-50"
        >
          +
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Список */}
      {loading ? (
        <p className="text-sm text-gray-500">Загрузка…</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-gray-500">Категорий пока нет.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {categories.map((cat) => (
            <li
              key={cat}
              className="flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <span>{cat}</span>
              <button
                type="button"
                onClick={() => remove(cat)}
                disabled={busy}
                aria-label={`Удалить категорию ${cat}`}
                className="rounded border border-red-300 px-2 py-1 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
