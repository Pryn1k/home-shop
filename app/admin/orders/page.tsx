import fs from "fs";
import path from "path";
import OrdersBoard from "@/components/OrdersBoard";
import type { Order } from "@/types/order";

export default async function AdminOrdersPage() {
  const filePath = path.join(process.cwd(), "data", "orders.json");

  const fileData = fs.readFileSync(filePath, "utf-8");
  const orders: Order[] = JSON.parse(fileData);

  const total = orders.length;

  const newOrders = orders.filter(o => o.status === "new").length;

  const processing = orders.filter(o => o.status === "processing").length;

  const done = orders.filter(o => o.status === "done").length;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        📦 Заказы
      </h1>
      <div className="grid grid-cols-4 gap-4 mb-6">

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