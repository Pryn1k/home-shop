"use client";

import type { Order } from "@/types/order";

export default function OrderCard({ order }: { order: Order }) {
  const updateStatus = async (status: string) => {
    await fetch("/api/order/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: order.id,
        status,
      }),
    });

    window.location.reload();
  };

  return (
    <div className="border rounded-xl p-4">
      <p><b>ID:</b> {order.id}</p>
      <p><b>Товар:</b> {order.productId}</p>
      <p><b>Имя:</b> {order.name}</p>
      <p><b>Телефон:</b> {order.phone}</p>
      <p><b>Комментарий:</b> {order.comment}</p>

      <p className="mt-2">
        <b>Статус:</b>{" "}
        <span
          className={
            order.status === "new"
              ? "text-red-500"
              : order.status === "processing"
              ? "text-yellow-500"
              : "text-green-600"
          }
        >
          {order.status}
        </span>
      </p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => updateStatus("processing")}
          className="px-2 py-1 border rounded"
        >
          В работу
        </button>

        <button
          onClick={() => updateStatus("done")}
          className="px-2 py-1 border rounded"
        >
          Готово
        </button>
      </div>
    </div>
  );
}