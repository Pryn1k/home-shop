"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, type CartItem } from "@/context/CartContext";

export default function AddToCartButton({
  product,
}: {
  product: Omit<CartItem, "qty">;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product);
    setAdded(true);
  };

  return (
    <div className="mt-6 flex flex-col gap-2">
      <button
        onClick={handleAdd}
        className="rounded bg-accent py-3 font-medium text-neutral-900 transition hover:opacity-90"
      >
        {added ? "Добавить ещё" : "В корзину"}
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
