"use client";

import { useState } from "react";
import type { Order } from "@/types/order";

export default function OrderCard({ order }: { order: Order }) {
  const [busy, setBusy] = useState(false);

  const updateStatus = async (status: string) => {
    setBusy(true);
    await fetch("/api/order/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status }),
    });
    window.location.reload();
  };

  const removeOrder = async () => {
    if (!confirm("Удалить заказ безвозвратно?")) return;
    setBusy(true);
    const res = await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setBusy(false);
      alert("Не удалось удалить заказ");
    }
  };

  return (
    <div className="border rounded-xl p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold">
          Заказ {order.orderNo != null ? `№${order.orderNo}` : `#${order.id}`}
        </h3>
        <span
          className={`text-sm font-medium ${
            order.status === "new"
              ? "text-red-500"
              : order.status === "processing"
              ? "text-yellow-500"
              : "text-green-600"
          }`}
        >
          {order.status === "new"
            ? "🆕 новый"
            : order.status === "processing"
            ? "🟡 в работе"
            : "🟢 готово"}
        </span>
      </div>

      {order.items && order.items.length > 0 ? (
        <div className="my-1">
          <b>Товары:</b>
          <ul className="ml-4 list-disc">
            {order.items.map((it, idx) => (
              <li key={idx}>
                {it.title} — {it.qty} × {it.price} грн = {it.price * it.qty} грн
              </li>
            ))}
          </ul>
          <p>
            <b>Сумма:</b> {order.total} грн
          </p>
        </div>
      ) : (
        <p>
          <b>Товар:</b> {order.productId}
        </p>
      )}

      <p>
        <b>Имя:</b> {order.name}
      </p>
      <p>
        <b>Телефон:</b>{" "}
        <a href={`tel:${order.phone}`} className="text-accent hover:underline">
          {order.phone}
        </a>
      </p>
      {order.comment && (
        <p>
          <b>Комментарий:</b> {order.comment}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => updateStatus("processing")}
          disabled={busy}
          className="px-2 py-1 border rounded transition hover:bg-white/10 disabled:opacity-50"
        >
          В работу
        </button>
        <button
          onClick={() => updateStatus("done")}
          disabled={busy}
          className="px-2 py-1 border rounded transition hover:bg-white/10 disabled:opacity-50"
        >
          Готово
        </button>
        <button
          onClick={removeOrder}
          disabled={busy}
          className="ml-auto px-2 py-1 border border-red-500/60 rounded text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
