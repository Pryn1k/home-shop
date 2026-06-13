"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { shop } from "@/lib/shop";

export default function Footer() {
  const pathname = usePathname();

  // в админке подвал не нужен
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-border bg-surface px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 text-sm sm:grid-cols-3">
        {/* О магазине */}
        <div>
          <p className="mb-2 text-base font-bold">
            Магазин <span className="text-accent">Домашний</span>
          </p>
          <p className="text-muted">Техника для дома: телефоны, телевизоры и не только.</p>
        </div>

        {/* Контакты */}
        <div className="flex flex-col gap-1">
          <p className="mb-1 font-semibold">Контакты</p>
          <p className="text-muted">{shop.address}</p>
          <a href={`tel:${shop.phoneHref}`} className="hover:text-accent">
            {shop.phone}
          </a>
          {shop.telegram && (
            <a
              href={shop.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              Telegram
            </a>
          )}
        </div>

        {/* Часы + навигация */}
        <div className="flex flex-col gap-1">
          <p className="mb-1 font-semibold">Время работы</p>
          {shop.hours.map((h) => (
            <p key={h.days} className="text-muted">
              {h.days}: {h.time}
            </p>
          ))}
          <Link href="/#contacts" className="mt-2 hover:text-accent">
            Как нас найти →
          </Link>
          <Link href="/order" className="hover:text-accent">
            Проверить заказ →
          </Link>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} {shop.name}
      </p>
    </footer>
  );
}
