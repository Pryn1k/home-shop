import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Лёгкий счётчик посещений витрины.
// Пишется только для публичных страниц (не /admin, не /api).
// visitor_id — анонимный случайный идентификатор в cookie, без персональных данных.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const rawPath = body && typeof body.path === "string" ? body.path : null;
    const path = rawPath ? rawPath.slice(0, 200) : null;

    // не считаем админку и api
    if (!path || path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }

    const jar = await cookies();
    let vid = jar.get("vid")?.value;

    const res = NextResponse.json({ ok: true });

    if (!vid) {
      vid = crypto.randomUUID();
      res.cookies.set("vid", vid, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // год
        path: "/",
      });
    }

    const { error } = await supabaseAdmin
      .from("page_views")
      .insert({ path, visitor_id: vid });
    if (error) console.error("track insert error:", error.message);

    return res;
  } catch {
    // статистика не должна ломать сайт — молча игнорируем
    return NextResponse.json({ ok: false });
  }
}
