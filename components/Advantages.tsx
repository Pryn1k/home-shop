const items = [
  {
    title: "Гарантия",
    text: "На всю технику",
    icon: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
  },
  {
    title: "Самовывоз и доставка",
    text: "Заберите сами или привезём",
    icon: (
      <>
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
  },
  {
    title: "Консультация",
    text: "Поможем выбрать",
    icon: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    ),
  },
  {
    title: "Удобная оплата",
    text: "Картой или наличными",
    icon: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <path d="M1 10h22" />
      </>
    ),
  },
];

export default function Advantages() {
  return (
    <section className="border-y border-border bg-surface/40 px-6 py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-accent"
            >
              {it.icon}
            </svg>
            <div>
              <p className="font-semibold leading-tight">{it.title}</p>
              <p className="text-sm text-muted">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
