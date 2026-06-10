"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // в админке своя навигация (AdminMenu) — общую шапку не показываем
  if (pathname.startsWith("/admin")) return null;

  const isHome = pathname === "/";
  // прозрачная поверх hero только на главной у самого верха
  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300 ${
        transparent
          ? "bg-transparent text-foreground"
          : "border-b border-border bg-surface/80 text-foreground backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        {/* Логотип — ссылка на главную (заменяет плавающую кнопку-домик) */}
        <Link href="/" className="text-lg font-bold tracking-tight">
          Магазин <span className="text-accent">Домашний</span>
        </Link>

        {/* Кластер контролов справа */}
        <div className="flex items-center gap-0.5">
          {/* Язык — пока заглушка, локализация позже */}
          <button
            type="button"
            disabled
            title="Скоро: украинский язык"
            aria-label="Язык (скоро)"
            className="flex h-9 cursor-not-allowed items-center gap-1 rounded-full px-2.5 text-sm font-medium opacity-60"
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
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            RU
          </button>

          {/* Тема День/Ночь */}
          <ThemeToggle />

          {/* Корзина */}
          <Link
            href="/cart"
            aria-label="Корзина"
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-foreground/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-neutral-900">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
