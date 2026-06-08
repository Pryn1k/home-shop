"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeButton() {
  const pathname = usePathname();

  // на самой главной кнопка не нужна
  if (pathname === "/") {
    return null;
  }

  return (
    <Link
      href="/"
      aria-label="На главную"
      className="fixed top-4 left-4 z-40 flex items-center justify-center w-11 h-11 rounded-full border bg-white text-gray-800 shadow hover:shadow-md transition"
    >
      {/* иконка домика — залитая, чуть крупнее */}
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
    </Link>
  );
}
