"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Невидимый компонент: при каждой смене публичной страницы
// отправляет заход на /api/track. Боты без JS не считаются.
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
