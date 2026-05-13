import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "orders.json");

export async function POST(req: Request) {
  const { id, status } = await req.json();

  const fileData = fs.readFileSync(filePath, "utf-8");
  const orders = JSON.parse(fileData);

  let updatedOrder: any = null;

  const updated = orders.map((order: any) => {
    if (order.id === id) {
      updatedOrder = { ...order, status };
      return updatedOrder;
    }
    return order;
  });

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

  // 📩 TELEGRAM УВЕДОМЛЕНИЕ
  const statusText =
    status === "processing"
      ? "🟡 В работе (пакуем заказ)"
      : status === "done"
      ? "🟢 Заказ выполнен"
      : "🔴 Новый статус";

  const message = `
📦 Обновление заказа

ID: ${updatedOrder?.id}
Статус: ${statusText}
Имя: ${updatedOrder?.name}
Телефон: ${updatedOrder?.phone}
`;

  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
      }),
    }
  );

  return NextResponse.json({ success: true });
}