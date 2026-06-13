import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// только цифры — чтобы сравнивать телефоны без учёта формата (+, пробелы, скобки)
const digits = (s: string) => (s || "").replace(/\D/g, "");

// Публичная проверка статуса заказа.
// Требуем номер заказа И телефон: номера последовательные,
// так что без телефона нельзя перебором смотреть чужие заказы.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const orderNo = Number(body?.orderNo);
    const phone = typeof body?.phone === "string" ? body.phone : "";

    if (!Number.isInteger(orderNo) || orderNo <= 0 || digits(phone).length < 5) {
      return NextResponse.json({ found: false });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        "order_no, status, created_at, items, total, delivery, payment, delivery_address, phone"
      )
      .eq("order_no", orderNo)
      .maybeSingle();

    // одинаковый ответ и когда заказа нет, и когда телефон не совпал —
    // чтобы нельзя было понять, существует ли такой номер
    if (error || !data || digits(data.phone) !== digits(phone)) {
      return NextResponse.json({ found: false });
    }

    // отдаём только безопасный набор (без имени/телефона — покупатель их и так знает)
    return NextResponse.json({
      found: true,
      order: {
        orderNo: data.order_no,
        status: data.status,
        createdAt: data.created_at,
        items: data.items ?? null,
        total: data.total ?? null,
        delivery: data.delivery ?? "pickup",
        payment: data.payment ?? "on_receipt",
        deliveryAddress: data.delivery_address ?? null,
      },
    });
  } catch {
    return NextResponse.json({ found: false });
  }
}
