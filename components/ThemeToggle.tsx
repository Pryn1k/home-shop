"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  // null пока не смонтировались — чтобы не было рассинхрона с сервером
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // тему уже выставил инлайн-скрипт в <head>, просто читаем её
    const current: Theme = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  // до монтирования не рисуем иконку, чтобы не «прыгала»
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Включить ночную тему" : "Включить дневную тему"}
      title={isLight ? "Ночь" : "День"}
      className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-foreground/10"
    >
      {theme === null ? (
        // нейтральная заглушка до монтирования
        <span className="block h-5 w-5" />
      ) : isLight ? (
        // солнце (сейчас день) — клик переключит на ночь
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
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // луна (сейчас ночь) — клик переключит на день
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
