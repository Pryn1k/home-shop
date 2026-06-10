"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/types/product";
import ProductForm from "./ProductForm";

export default function AdminEditButton({
  product,
  className = "",
  label,
}: {
  product: Product;
  className?: string;
  /** если задан — кнопка с текстом; иначе компактный карандашик */
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    // не даём сработать ссылке карточки
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label="Редактировать товар"
        title="Редактировать"
        className={
          label
            ? `inline-flex items-center gap-2 rounded-lg border border-accent px-4 py-2 font-medium text-accent transition hover:bg-accent hover:text-neutral-900 ${className}`
            : `flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow transition hover:border-accent hover:text-accent ${className}`
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
        {label}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 text-gray-900 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Редактировать товар</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть"
                  className="text-2xl leading-none text-gray-500 hover:text-gray-900"
                >
                  ×
                </button>
              </div>

              <ProductForm
                mode="edit"
                product={product}
                onDone={() => setOpen(false)}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
