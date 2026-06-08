import { createClient } from "@supabase/supabase-js";

// Серверный клиент с секретным ключом (service_role / secret key).
// Обходит RLS — используется ТОЛЬКО на сервере для записи (добавление товаров,
// загрузка фото). Никогда не импортировать в клиентские ("use client") компоненты.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
