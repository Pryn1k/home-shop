"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, type CartItem } from "@/context/CartContext";

export default function AddToCartButton({
  product,
}: {
  product: Omit<CartItem, "qty">;
}) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart =
    items.find((i) => i.productId === product.productId)?.qty ?? 0;
  const outOfStock = product.stock === 0;
  const reachedLimit = product.stock != null && inCart >= product.stock;

  const handleAdd = () => {
    add(product);
    setAdded(true);
  };

  if (outOfStock) {
    return (
      <p className="mt-6 rounded border bg-surface py-3 text-center font-medium text-muted">
        Нет в наличии
      </p>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-2">
      {product.stock != null && (
        <p className="text-sm text-muted">В наличии: {product.stock} шт</p>
      )}

      <button
        onClick={handleAdd}
        disabled={reachedLimit}
        className="rounded bg-accent py-3 font-bold text-neutral-900 transition hover:opacity-90 disabled:opacity-50"
      >
        {reachedLimit
          ? "Больше нет в наличии"
          : added
          ? "Добавить ещё"
          : "В корзину"}
      </button>

      {added && (
        <Link
          href="/cart"
          className="text-center text-accent underline underline-offset-2"
        >
          Перейти в корзину →
        </Link>
      )}
    </div>
  );
}
