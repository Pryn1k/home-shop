import { cookies } from "next/headers";

// Залогинен ли админ (та же кука, что проверяет proxy.ts).
// Используется в серверных компонентах витрины, чтобы показывать админ-кнопки.
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin-auth")?.value === "true";
}
