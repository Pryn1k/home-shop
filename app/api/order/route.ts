import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type IncomingItem = { productId: string; qty: number };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, comment, items } = body as {
      name: string;
      phone: string;
      comment?: string;
      items: IncomingItem[];
    };

    if (!name?.trim() || !phone?.trim() || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Укажите имя, телефон и товары" },
        { status: 400 }
      );
    }

    // нормализуем количество и собираем id (доверяем только productId и qty)
    const wanted = items
      .map((i) => ({ productId: String(i.productId), qty: Math.floor(Number(i.qty)) }))
      .filter((i) => i.productId && i.qty > 0);

    if (wanted.length === 0) {
      return NextResponse.json(
        { success: false, error: "Некорректные позиции заказа" },
        { status: 400 }
      );
    }

    // тянем актуальные данные товаров из БД — цены и наличие берём ОТСЮДА, не с клиента
    const ids = wanted.map((i) => i.productId);
    const { data: prods, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("id, title, price, stock")
      .in("id", ids);

    if (prodErr) {
      console.error(prodErr);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const byId = new Map((prods ?? []).map((p) => [p.id, p]));

    // собираем позиции заказа на сервере + проверяем наличие
    const orderItems: {
      productId: string;
      title: string;
      price: number;
      qty: number;
    }[] = [];

    for (const it of wanted) {
      const product = byId.get(it.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: "Товар не найден" },
          { status: 400 }
        );
      }
      if (product.stock != null && it.qty > product.stock) {
        return NextResponse.json(
          {
            success: false,
            error: `Недостаточно товара «${product.title}» (в наличии ${product.stock})`,
          },
          { status: 400 }
        );
      }
      orderItems.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        qty: it.qty,
      });
    }

    // итог считаем на сервере
    const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    // сохраняем заказ
    const { error } = await supabaseAdmin.from("orders").insert([
      {
        name: name.trim(),
        phone: phone.trim(),
        comment: comment?.trim() || null,
        items: orderItems,
        total,
        status: "new",
      },
    ]);

    if (error) {
      console.error(error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // уменьшаем остатки заказанных товаров
    for (const it of orderItems) {
      const product = byId.get(it.productId);
      if (product?.stock != null) {
        await supabaseAdmin
          .from("products")
          .update({ stock: product.stock - it.qty })
          .eq("id", it.productId);
      }
    }

    // Telegram-уведомление (значения серверные)
    const lines = orderItems
      .map(
        (i) =>
          `• ${i.title} — ${i.qty} × ${i.price} грн = ${i.price * i.qty} грн`
      )
      .join("\n");

    const message = `🛒 Новый заказ

${lines}

💰 Сумма: ${total} грн
👤 Имя: ${name.trim()}
📱 Телефон: ${phone.trim()}
💬 Комментарий: ${comment?.trim() || "—"}`;

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
