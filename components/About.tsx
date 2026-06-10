"use client";

import { useEffect, useRef } from "react";
import { shop } from "@/lib/shop";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // уважаем «уменьшить движение» — без паралlax
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        const layer = layerRef.current;
        if (!el || !layer) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // прогресс прохождения секции через экран: -1 (снизу) … +1 (сверху)
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        // фон смещается в противоход контенту — эффект параллакса
        layer.style.transform = `translate3d(0, ${(-progress * 70).toFixed(
          1
        )}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden px-6 py-20"
    >
      {/* аврора-подложка (как в hero), двигается на скролле */}
      <div
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-1/4 -z-10 h-[150%] opacity-70 will-change-transform"
      >
        <span className="hero-blob hero-blob-1" />
        <span className="hero-blob hero-blob-2" />
        <span className="hero-blob hero-blob-3" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-2xl font-bold">О нас</h2>
        <p className="text-lg leading-relaxed">{shop.about}</p>
      </div>
    </section>
  );
}
