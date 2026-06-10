import { shop } from "@/lib/shop";

export default function Contacts() {
  return (
    <section id="contacts" className="border-t border-border px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-2xl font-bold">Как нас найти</h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Левая колонка — адрес, часы, связь */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">
                Адрес
              </h3>
              <p className="text-lg">{shop.address}</p>
              <a
                href={shop.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2"
              >
                Открыть в Google Maps →
              </a>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                Время работы
              </h3>
              <ul className="flex flex-col gap-1">
                {shop.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4 max-w-xs">
                    <span>{h.days}</span>
                    <span className="text-muted">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${shop.phoneHref}`}
                className="rounded-lg bg-accent px-5 py-2.5 font-bold text-neutral-900 transition hover:opacity-90"
              >
                Позвонить: {shop.phone}
              </a>
              {shop.telegram && (
                <a
                  href={shop.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-accent px-5 py-2.5 font-medium text-accent transition hover:bg-accent hover:text-neutral-900"
                >
                  Telegram
                </a>
              )}
            </div>
          </div>

          {/* Правая колонка — карта (с запасным слоём, если iframe заблокирован) */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-img-bg">
            <a
              href={shop.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-muted"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{shop.address}</span>
              <span className="font-medium text-accent underline">Открыть карту →</span>
            </a>
            <iframe
              title="Карта проезда"
              src={shop.mapEmbedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="relative h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
