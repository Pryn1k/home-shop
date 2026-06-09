import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  buildImagesFromForm,
  removeImagesFromStorage,
} from "@/lib/productImages";

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

    if (!title || !price) {
      return NextResponse.json(
        { success: false, error: "Заполните название и цену" },
        { status: 400 }
      );
    }

    // какие фото были раньше — чтобы потом убрать лишние из Storage
    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("image, images")
      .eq("id", id)
      .single();

    const result = await buildImagesFromForm(formData);
    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
        title,
        price,
        old_price,
        category,
        image: result.image,
        images: result.images,
      })
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

    // best-effort: удаляем из Storage фото, которые больше не используются
    const oldUrls = [
      ...(existing?.images ?? []),
      ...(existing?.image ? [existing.image] : []),
    ];
    const stillUsed = new Set(result.images);
    const orphans = oldUrls.filter((u) => !stillUsed.has(u));
    if (orphans.length > 0) {
      await removeImagesFromStorage(orphans);
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

  // узнаём картинки товара, чтобы убрать их из Storage
  const { data: existing } = await supabaseAdmin
    .from("products")
    .select("image, images")
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

  const urls = [
    ...(existing?.images ?? []),
    ...(existing?.image ? [existing.image] : []),
  ];
  if (urls.length > 0) {
    await removeImagesFromStorage(urls);
  }

  return NextResponse.json({ success: true });
}
