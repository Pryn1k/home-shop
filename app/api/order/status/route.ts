import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  // только админ может менять статус заказа
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Нет доступа" },
      { status: 401 }
    );
  }

  const { id, status } = await req.json();

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
