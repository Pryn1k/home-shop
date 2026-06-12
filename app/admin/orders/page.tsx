import OrdersBoard from "@/components/OrdersBoard";
import type { Order } from "@/types/order";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// заказы всегда тянем свежие из базы
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  // читаем заказы на сервере секретным ключом (обходит RLS)
  const { data } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  // приводим поля базы (snake_case) к типу Order (camelCase)
  const orders: Order[] = (data ?? []).map((o) => ({
    id: o.id,
    productId: o.product_id,
    name: o.name,
    phone: o.phone,
    comment: o.comment,
    status: o.status,
    createdAt: o.created_at,
    items: o.items ?? null,
    total: o.total ?? null,
  }));

  const total = orders.length;

  const newOrders = orders.filter(o => o.status === "new").length;

  const processing = orders.filter(o => o.status === "processing").length;

  const done = orders.filter(o => o.status === "done").length;

  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <h1 className="text-2xl font-bold mb-6">
        📦 Заказы
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

        <div className="border p-3 rounded">
          📦 Всего: {total}
        </div>

        <div className="border p-3 rounded">
          🆕 Новых: {newOrders}
        </div>

        <div className="border p-3 rounded">
          🟡 В работе: {processing}
        </div>

        <div className="border p-3 rounded">
          🟢 Готово: {done}
        </div>

      </div>
      <OrdersBoard orders={orders} />
    </main>
  );
}
