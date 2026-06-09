import { Product } from "@/types/product";
import { supabase } from "@/lib/supabase";

// Список всех товаров (новые сверху)
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, price, oldPrice:old_price, image, images, category, createdAt:created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts error:", error);
    return [];
  }

  return data ?? [];
};

// Один товар по id (для страницы товара)
export const getProduct = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, price, oldPrice:old_price, image, images, category, createdAt:created_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProduct error:", error);
    return null;
  }

  return data;
};
