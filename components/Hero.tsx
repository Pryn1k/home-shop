import HomeSearch from "./HomeSearch";

export default function Hero() {
  return (
    <section className="relative h-[75vh] w-full overflow-hidden text-foreground">
      {/* ФОН — аврора: цветное свечение генерится кодом (картинка не нужна).
          База зависит от темы: ночью тёмная, днём светлая. */}
      <div className="absolute inset-0 overflow-hidden bg-hero-base">
        <span className="hero-blob hero-blob-1" />
        <span className="hero-blob hero-blob-2" />
        <span className="hero-blob hero-blob-3" />
      </div>

      {/* лёгкое затемнение — только в тёмной теме (днём прозрачно) */}
      <div className="absolute inset-0 bg-[var(--hero-scrim)]" />

      {/* КОНТЕНT */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <span className="hero-magazin text-3xl font-light tracking-[0.3em] sm:text-5xl">
          Магазин
        </span>

        <svg
          viewBox="0 0 640 150"
          className="h-24 w-full max-w-2xl sm:h-36"
          role="img"
          aria-label="Домашний"
        >
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="hero-draw-text"
            fontSize="110"
            fontWeight="700"
          >
            Домашний
          </text>
        </svg>

        <HomeSearch />
      </div>
    </section>
  );
}
