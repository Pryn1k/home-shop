import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  // 1. Проверяем, что запрос от залогиненного админа
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Нет доступа" },
      { status: 401 }
    );
  }

  try {
    // 2. Читаем данные формы (multipart, т.к. есть файл)
    const formData = await req.formData();

    const title = (formData.get("title") as string)?.trim();
    const price = Number(formData.get("price"));
    const category = (formData.get("category") as string) || null;
    const file = formData.get("image") as File | null;

    if (!title || !price || !file) {
      return NextResponse.json(
        { success: false, error: "Заполните название, цену и фото" },
        { status: 400 }
      );
    }

    // 3. Загружаем фото в Storage (bucket "product-images")
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-images")
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) {
      console.error("upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Не удалось загрузить фото" },
        { status: 500 }
      );
    }

    // 4. Получаем публичную ссылку на загруженное фото
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(fileName);

    // 5. Сохраняем товар в таблицу products
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([
        {
          title,
          price,
          category,
          image: publicUrlData.publicUrl,
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
