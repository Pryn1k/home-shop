import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Описание порядка картинок, который шлёт форма:
//  { k: "url", v: "<существующая ссылка>" } — оставить как есть
//  { k: "new", v: <индекс файла в newImages> } — загрузить новый файл
type OrderItem = { k: "url"; v: string } | { k: "new"; v: number };

const BUCKET = "product-images";

/**
 * Собирает финальный набор картинок товара из данных формы:
 * загружает новые файлы в Storage, сохраняет порядок, возвращает
 * обложку (image = первое фото) и весь массив (images).
 */
export async function buildImagesFromForm(
  formData: FormData
): Promise<{ image: string; images: string[] } | { error: string }> {
  const orderRaw = formData.get("imagesOrder") as string | null;

  let order: OrderItem[] = [];
  try {
    order = orderRaw ? JSON.parse(orderRaw) : [];
  } catch {
    return { error: "Некорректные данные изображений" };
  }

  const newFiles = formData
    .getAll("newImages")
    .filter((f): f is File => f instanceof File && f.size > 0);

  // загружаем новые файлы по порядку
  const uploadedUrls: string[] = [];
  for (const file of newFiles) {
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${uploadedUrls.length}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) {
      console.error("upload error:", uploadError);
      return { error: "Не удалось загрузить фото" };
    }

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName);
    uploadedUrls.push(data.publicUrl);
  }

  // собираем итоговый массив в нужном порядке
  const images: string[] = [];
  for (const item of order) {
    if (item.k === "url") {
      images.push(item.v);
    } else if (item.k === "new") {
      const url = uploadedUrls[item.v];
      if (url) images.push(url);
    }
  }

  if (images.length === 0) {
    return { error: "Добавьте хотя бы одно фото" };
  }

  return { image: images[0], images };
}

/** Удаляет из Storage файлы по их публичным ссылкам (best-effort). */
export async function removeImagesFromStorage(urls: string[]) {
  const marker = `/${BUCKET}/`;
  const fileNames = urls
    .filter((u) => u.includes(marker))
    .map((u) => u.split(marker)[1]);

  if (fileNames.length > 0) {
    await supabaseAdmin.storage.from(BUCKET).remove(fileNames);
  }
}
