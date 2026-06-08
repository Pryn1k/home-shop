"use client";

import { useState } from "react";

type Props = {
  productId: string;
};

export default function OrderForm({ productId }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitOrder = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          name,
          phone,
          comment,
        }),
      });

      if (response.ok) {
        setSuccess(true);

        setName("");
        setPhone("");
        setComment("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mt-4 text-green-600">
        Заказ отправлен!
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-3">

      <input
        className="border p-2 rounded"
        placeholder="Ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 rounded"
        placeholder="Телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <textarea
        className="border p-2 rounded"
        placeholder="Комментарий"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={submitOrder}
        disabled={loading}
        className="bg-accent text-neutral-900 font-medium py-2 rounded transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Отправка..." : "Заказать"}
      </button>

    </div>
  );
}