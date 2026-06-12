import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-7xl font-extrabold text-accent">404</p>
      <h1 className="text-2xl font-bold">Страница не найдена</h1>
      <p className="max-w-md text-muted">
        Возможно, ссылка устарела или товар больше не доступен.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-accent px-5 py-2.5 font-bold text-neutral-900 transition hover:opacity-90"
        >
          На главную
        </Link>
        <Link
          href="/products"
          className="rounded-lg border border-accent px-5 py-2.5 font-medium text-accent transition hover:bg-accent hover:text-neutral-900"
        >
          К товарам
        </Link>
      </div>
    </main>
  );
}
