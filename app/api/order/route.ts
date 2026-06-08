import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // сохраняем в Supabase (на сервере, секретным ключом — обходит RLS)
    const { error } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          product_id: body.productId,
          name: body.name,
          phone: body.phone,
          comment: body.comment,
          status: "new",
        },
      ]);

    if (error) {
      console.error(error);

      return NextResponse.json(
        { success: false },
        { status: 500 }
      );
    }

    // Telegram
    const message = `
🛒 Новый заказ

📦 Товар: ${body.productId}
👤 Имя: ${body.name}
📱 Телефон: ${body.phone}
💬 Комментарий: ${body.comment}
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

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}