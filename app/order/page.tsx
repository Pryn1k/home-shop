import type { Metadata } from "next";
import OrderLookup from "@/components/OrderLookup";

export const metadata: Metadata = {
  title: "Проверить заказ",
  description: "Узнайте статус вашего заказа по номеру и телефону.",
};

export default function OrderLookupPage() {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <h1 className="mb-2 text-2xl font-bold">Проверить заказ</h1>
      <p className="mb-6 text-sm text-muted">
        Введите номер заказа из чека и телефон, который указывали при
        оформлении.
      </p>
      <OrderLookup />
    </main>
  );
}
