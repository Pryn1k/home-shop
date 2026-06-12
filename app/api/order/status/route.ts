import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdmin } from "@/lib/auth";

const ALLOWED_STATUSES = ["new", "processing", "done"];

export async function POST(req: Request) {
  // только админ может менять статус заказа
  if (!(await isAdmin())) {
    return NextResponse.json(
      { success: false, error: "Нет доступа" },
      { status: 401 }
    );
  }

  const { id, status } = await req.json();

  // принимаем только известные статусы (фикс №5)
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { success: false, error: "Неизвестный статус" },
      { status: 400 }
    );
  }

  // обновляем статус в базе и забираем обновлённую строку
  const { data: updatedOrder, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error || !updatedOrder) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  // 📩 TELEGRAM УВЕДОМЛЕНИЕ
  const statusText =
    status === "processing"
      ? "🟡 В работе (пакуем заказ)"
      : status === "done"
      ? "🟢 Заказ выполнен"
      : "🔴 Новый статус";

  const message = `
📦 Обновление заказа

ID: ${updatedOrder.id}
Статус: ${statusText}
Имя: ${updatedOrder.name}
Телефон: ${updatedOrder.phone}
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
