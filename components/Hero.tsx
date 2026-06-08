export default function Hero() {
  return (
    <section className="relative h-[75vh] w-full overflow-hidden text-white">
      {/* ФОН — пока заглушка-градиент. Когда будет фото, замени этот div
          на <Image src="..." fill className="object-cover" /> */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700" />

      {/* затемнение — для контраста текста (особенно когда поставишь фото) */}
      <div className="absolute inset-0 bg-black/30" />

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
      </div>
    </section>
  );
}
