import { NextResponse } from "next/server";
import { getCategories } from "@/services/category.service";

// Публичный список категорий (для фильтра и формы товара)
export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}
