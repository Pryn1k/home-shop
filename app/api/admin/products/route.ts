import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { buildImagesFromForm } from "@/lib/productImages";
import { isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  // 1. Проверяем, что запрос от залогиненного админа
  if (!(await isAdmin())) {
    return NextResponse.json(
      { success: false, error: "Нет доступа" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();

    const title = (formData.get("title") as string)?.trim();
    const price = Number(formData.get("price"));
    const oldPriceRaw = formData.get("oldPrice");
    const old_price = oldPriceRaw ? Number(oldPriceRaw) : null;
    const category = (formData.get("category") as string) || null;
    const stockRaw = formData.get("stock");
    const stock = stockRaw ? Number(stockRaw) : null;

    if (!title || !price) {
      return NextResponse.json(
        { success: false, error: "Заполните название и цену" },
        { status: 400 }
      );
    }

    // загружаем фото и собираем обложку + массив
    const result = await buildImagesFromForm(formData);
    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([
        {
          title,
          price,
          old_price,
          category,
          stock,
          image: result.image,
          images: result.images,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("insert error:", error);
      return NextResponse.json(
        { success: false, error: "Не удалось сохранить товар" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
