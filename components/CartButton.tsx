"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const pathname = usePathname();
  const { count } = useCart();

  // не показываем в админке и на самой странице корзины
  if (pathname.startsWith("/admin") || pathname === "/cart") return null;

  return (
    <Link
      href="/cart"
      aria-label="Корзина"
      className="fixed top-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border bg-white text-gray-800 shadow transition hover:shadow-md"
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
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-neutral-900">
          {count}
        </span>
      )}
    </Link>
  );
}
