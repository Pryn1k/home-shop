"use client";

import { useEffect, useRef, useState } from "react";
import { shop } from "@/lib/shop";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false); // JS навесил эффект (без JS — текст просто виден)
  const [shown, setShown] = useState(false); // блок попал в зону видимости

  // паралlax аврора-подложки
  useEffect(() => {
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
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
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

  // появление текста по строкам при прокрутке к блоку
  useEffect(() => {
    setArmed(true);
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // разбиваем текст на предложения — каждое выезжает отдельной «строкой»
  const sentences = shop.about.split(/(?<=\.)\s+/).filter(Boolean);

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

      <div
        className={`mx-auto max-w-3xl text-center ${
          armed ? "reveal-armed" : ""
        } ${shown ? "reveal-visible" : ""}`}
      >
        <h2 className="reveal-line mb-4 text-2xl font-bold">
          <span>О нас</span>
        </h2>
        <p className="text-lg leading-relaxed">
          {sentences.map((s, i) => (
            <span key={i} className="reveal-line">
              <span style={{ transitionDelay: `${0.12 * (i + 1)}s` }}>
                {s}{" "}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
