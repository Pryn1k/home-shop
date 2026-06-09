import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type OrderItem = {
  productId: string;
  title: string;
  price: number;
  qty: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, comment, items, total } = body as {
      name: string;
      phone: string;
      comment?: string;
      items: OrderItem[];
      total: number;
    };

    if (!name || !phone || !items || items.length === 0) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // сохраняем заказ (на сервере, секретным ключом)
    const { error } = await supabaseAdmin.from("orders").insert([
      {
        name,
        phone,
        comment: comment ?? null,
        items,
        total,
        status: "new",
      },
    ]);

    if (error) {
      console.error(error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // Telegram-уведомление со списком позиций
    const lines = items
      .map((i) => `• ${i.title} × ${i.qty} = ${i.price * i.qty} грн`)
      .join("\n");

    const message = `🛒 Новый заказ

${lines}

💰 Сумма: ${total} грн
👤 Имя: ${name}
📱 Телефон: ${phone}
💬 Комментарий: ${comment || "—"}`;

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
