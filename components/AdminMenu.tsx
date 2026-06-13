"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "./ProductForm";
import CategoryManager from "./CategoryManager";

export default function AdminMenu() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  // на странице логина меню не нужно
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setOpen(false);
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* КНОПКА-ШЕСТЕРЁНКА — под хедером, справа */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Меню админки"
        title="Админ-меню"
        className="fixed top-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow transition hover:text-accent hover:shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {/* ЗАТЕМНЕНИЕ */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[55] bg-black/40"
        />
      )}

      {/* БОКОВОЕ МЕНЮ */}
      <aside
        className={`fixed top-0 right-0 z-[60] h-full w-72 bg-white text-gray-900 border-l shadow-xl p-6 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Меню</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
            className="text-2xl leading-none text-gray-500 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
          >
            📊 Статистика
          </Link>

          <button
            onClick={() => {
              setAddOpen(true);
              setOpen(false);
            }}
            className="text-left rounded-lg px-3 py-2 hover:bg-gray-100 transition"
          >
            ➕ Добавить товар
          </button>

          <Link
            href="/admin/products"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
          >
            🛠 Управление товарами
          </Link>

          <button
            onClick={() => {
              setCatOpen(true);
              setOpen(false);
            }}
            className="text-left rounded-lg px-3 py-2 hover:bg-gray-100 transition"
          >
            🏷 Категории
          </button>

          <Link
            href="/admin/orders"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
          >
            📦 Список заказов
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto text-left rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 transition"
        >
          🚪 Выход
        </button>
      </aside>

      {/* МОДАЛКА «Добавить товар» — пока заглушка */}
      {addOpen && (
        <div
          onClick={() => setAddOpen(false)}
          className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 text-gray-900 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Добавить товар</h2>
              <button
                onClick={() => setAddOpen(false)}
                aria-label="Закрыть"
                className="text-2xl leading-none text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            <ProductForm mode="add" onDone={() => setAddOpen(false)} />
          </div>
        </div>
      )}

      {/* МОДАЛКА «Категории» */}
      {catOpen && (
        <div
          onClick={() => setCatOpen(false)}
          className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 text-gray-900 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Категории</h2>
              <button
                onClick={() => setCatOpen(false)}
                aria-label="Закрыть"
                className="text-2xl leading-none text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            <CategoryManager />
          </div>
        </div>
      )}
    </>
  );
}
