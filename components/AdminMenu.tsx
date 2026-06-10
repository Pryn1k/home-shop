"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "./ProductForm";

export default function AdminMenu() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

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
      {/* КНОПКА справа вверху */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Открыть меню"
        className="fixed top-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border bg-surface text-foreground shadow transition hover:shadow-md"
      >
        <span className="block w-5 space-y-1">
          <span className="block h-0.5 bg-foreground rounded" />
          <span className="block h-0.5 bg-foreground rounded" />
          <span className="block h-0.5 bg-foreground rounded" />
        </span>
      </button>

      {/* ЗАТЕМНЕНИЕ */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      {/* БОКОВОЕ МЕНЮ */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white text-gray-900 border-l shadow-xl p-6 flex flex-col transition-transform duration-300 ${
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
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
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
    </>
  );
}
