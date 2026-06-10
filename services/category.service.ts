import { supabase } from "@/lib/supabase";

// Список названий категорий (по алфавиту). Чтение публичное.
export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .order("name", { ascending: true });

  if (error) {
    console.error("getCategories error:", error);
    return [];
  }

  return (data ?? []).map((c) => c.name as string);
};
