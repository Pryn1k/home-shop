import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function ensureAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin-auth")?.value === "true";
}

// Добавить категорию
export async function POST(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ success: false, error: "Нет доступа" }, { status: 401 });
  }

  try {
    const { name } = (await req.json()) as { name?: string };
    const clean = name?.trim();

    if (!clean) {
      return NextResponse.json(
        { success: false, error: "Введите название категории" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("categories")
      .insert([{ name: clean }]);

    if (error) {
      // 23505 — нарушение уникальности (такая категория уже есть)
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, error: "Такая категория уже есть" },
          { status: 409 }
        );
      }
      console.error("category insert error:", error);
      return NextResponse.json(
        { success: false, error: "Не удалось добавить категорию" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Ошибка сервера" }, { status: 500 });
  }
}

// Удалить категорию (запрещаем, если в ней есть товары)
export async function DELETE(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ success: false, error: "Нет доступа" }, { status: 401 });
  }

  try {
    const { name } = (await req.json()) as { name?: string };
    const clean = name?.trim();

    if (!clean) {
      return NextResponse.json(
        { success: false, error: "Не указана категория" },
        { status: 400 }
      );
    }

    // сколько товаров используют эту категорию
    const { count, error: countError } = await supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category", clean);

    if (countError) {
      console.error("category count error:", countError);
      return NextResponse.json(
        { success: false, error: "Ошибка проверки товаров" },
        { status: 500 }
      );
    }

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Нельзя удалить: используется в ${count} товар(ах)`,
        },
        { status: 409 }
      );
    }

    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("name", clean);

    if (error) {
      console.error("category delete error:", error);
      return NextResponse.json(
        { success: false, error: "Не удалось удалить категорию" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Ошибка сервера" }, { status: 500 });
  }
}
