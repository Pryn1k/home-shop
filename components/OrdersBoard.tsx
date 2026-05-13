"use client";

import { useMemo, useState } from "react";
import OrderCard from "./OrderCard";
import type { Order } from "@/types/order";

export default function OrdersBoard({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<"all" | "new" | "processing" | "done">("all");

  const filtered = useMemo(() => {
    const data = filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

    // сортировка: новые сверху
    return [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, filter]);

  return (
    <div>
      {/* ФИЛЬТРЫ */}
      <div className="flex gap-2 mb-4">
        {["all", "new", "processing", "done"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1 border rounded ${
              filter === f ? "bg-black text-white" : ""
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* СПИСОК */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}