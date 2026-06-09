import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin-auth")?.value === "true";
}

// ИЗМЕНИТЬ товар
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { success: false, error: "Нет доступа" },
      { status: 401 }
    );
  }

  const { id } = await ctx.params;

  try {
    const formData = await req.formData();

    const title = (formData.get("title") as string)?.trim();
    const price = Number(formData.get("price"));
    const oldPriceRaw = formData.get("oldPrice");
    const old_price = oldPriceRaw ? Number(oldPriceRaw) : null;
    const category = (formData.get("category") as string) || null;
    const file = formData.get("image") as File | null;

    if (!title || !price) {
      return NextResponse.json(
        { success: false, error: "Заполните название и цену" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      title,
      price,
      old_price,
      category,
    };

    // фото меняем только если выбрали новое
    if (file && file.size > 0) {
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

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("product-images")
        .getPublicUrl(fileName);

      updateData.image = publicUrlData.publicUrl;
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("update error:", error);
      return NextResponse.json(
        { success: false, error: "Не удалось сохранить" },
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

// УДАЛИТЬ товар
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { success: false, error: "Нет доступа" },
      { status: 401 }
    );
  }

  const { id } = await ctx.params;

  // узнаём картинку товара, чтобы убрать её из Storage
  const { data: existing } = await supabaseAdmin
    .from("products")
    .select("image")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("delete error:", error);
    return NextResponse.json(
      { success: false, error: "Не удалось удалить" },
      { status: 500 }
    );
  }

  // best-effort: чистим файл из Storage, если он там лежал
  const marker = "/product-images/";
  if (existing?.image?.includes(marker)) {
    const fileName = existing.image.split(marker)[1];
    await supabaseAdmin.storage.from("product-images").remove([fileName]);
  }

  return NextResponse.json({ success: true });
}
