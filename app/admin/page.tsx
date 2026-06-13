import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();
  const weekAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    viewsTotalRes,
    viewsTodayRes,
    views7Res,
    visitorsRes,
    ordersRes,
    productsRes,
  ] = await Promise.all([
    supabaseAdmin.from("page_views").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayIso),
    supabaseAdmin
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgoIso),
    supabaseAdmin
      .from("page_views")
      .select("visitor_id, created_at")
      .gte("created_at", weekAgoIso)
      .limit(10000),
    supabaseAdmin.from("orders").select("total, status"),
    supabaseAdmin.from("products").select("title, stock"),
  ]);

  // ПОСЕЩЕНИЯ
  const viewsTotal = viewsTotalRes.count ?? 0;
  const viewsToday = viewsTodayRes.count ?? 0;
  const views7 = views7Res.count ?? 0;

  const visitorRows = visitorsRes.data ?? [];
  const uniq7 = new Set(
    visitorRows.map((v) => v.visitor_id).filter(Boolean)
  ).size;
  const uniqToday = new Set(
    visitorRows
      .filter((v) => v.created_at >= todayIso)
      .map((v) => v.visitor_id)
      .filter(Boolean)
  ).size;

  // ЗАКАЗЫ
  const orders = ordersRes.data ?? [];
  const ordersTotal = orders.length;
  const ordersNew = orders.filter((o) => o.status === "new").length;
  const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);

  // СКЛАД
  const products = productsRes.data ?? [];
  const productsTotal = products.length;
  const outOfStock = products.filter((p) => p.stock === 0);
  const lowStock = products.filter(
    (p) => p.stock != null && p.stock > 0 && p.stock <= 3
  );

  const money = new Intl.NumberFormat("ru-RU").format(revenue);

  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">📊 Статистика</h1>

      {/* ПОСЕЩЕНИЯ */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Посещения сайта
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Сегодня"
            value={viewsToday}
            hint={`${uniqToday} уник. посетителей`}
          />
          <StatCard
            label="За 7 дней"
            value={views7}
            hint={`${uniq7} уник. посетителей`}
          />
          <StatCard label="Всего просмотров" value={viewsTotal} />
          <StatCard
            label="Уник. за неделю"
            value={uniq7}
            hint="разные люди"
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Просмотр — открытие страницы. Уникальные — разные посетители (по
          анонимному cookie).
        </p>
      </section>

      {/* ЗАКАЗЫ */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Заказы
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Всего заказов" value={ordersTotal} />
          <StatCard label="Новых" value={ordersNew} />
          <StatCard label="Сумма заказов" value={`${money} грн`} />
        </div>
        <Link
          href="/admin/orders"
          className="mt-3 inline-block text-sm text-accent hover:underline"
        >
          Перейти к заказам →
        </Link>
      </section>

      {/* СКЛАД */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Склад
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Всего товаров" value={productsTotal} />
          <StatCard
            label="Заканчиваются"
            value={lowStock.length}
            hint="осталось ≤ 3 шт"
          />
          <StatCard label="Нет в наличии" value={outOfStock.length} />
        </div>

        {(lowStock.length > 0 || outOfStock.length > 0) && (
          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <p className="mb-2 text-sm font-semibold">⚠️ Обратите внимание</p>
            <ul className="space-y-1 text-sm">
              {outOfStock.map((p, i) => (
                <li key={`out-${i}`} className="text-muted">
                  <span className="text-foreground">{p.title}</span> — нет в
                  наличии
                </li>
              ))}
              {lowStock.map((p, i) => (
                <li key={`low-${i}`} className="text-muted">
                  <span className="text-foreground">{p.title}</span> — осталось{" "}
                  {p.stock} шт
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href="/admin/products"
          className="mt-3 inline-block text-sm text-accent hover:underline"
        >
          Управление товарами →
        </Link>
      </section>
    </main>
  );
}
