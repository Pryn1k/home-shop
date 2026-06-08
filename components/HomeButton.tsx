"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeButton() {
  const pathname = usePathname();

  // на самой главной кнопка не нужна
  if (pathname === "/") {
    return null;
  }

  // на странице конкретного товара — стрелка "назад к товарам",
  // на остальных страницах — домик "на главную"
  const isProductDetail = pathname.startsWith("/product/");
  const href = isProductDetail ? "/products" : "/";
  const label = isProductDetail ? "Назад к товарам" : "На главную";

  return (
    <Link
      href={href}
      aria-label={label}
      className="fixed top-4 left-4 z-40 flex items-center justify-center w-11 h-11 rounded-full border bg-white text-gray-800 shadow hover:shadow-md transition"
    >
      {isProductDetail ? (
        // стрелка назад
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      ) : (
        // домик — залитый, чуть крупнее
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      )}
    </Link>
  );
}
