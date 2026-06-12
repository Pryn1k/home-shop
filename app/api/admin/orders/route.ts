import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdmin } from "@/lib/auth";

// Удалить заказ (только админ)
export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Нет доступа" }, { status: 401 });
  }

  try {
    const { id } = (await req.json()) as { id?: number | string };
    if (id == null) {
      return NextResponse.json(
        { success: false, error: "Не указан заказ" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("orders").delete().eq("id", id);

    if (error) {
      console.error("order delete error:", error);
      return NextResponse.json(
        { success: false, error: "Не удалось удалить" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
