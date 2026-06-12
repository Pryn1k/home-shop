import { cookies } from "next/headers";
import { adminToken } from "./adminToken";

// Залогинен ли админ: кука должна совпадать с секретным токеном сессии.
// Используется в серверных компонентах и во всех админских route-обработчиках.
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const value = store.get("admin-auth")?.value;
  if (!value) return false;
  return value === (await adminToken());
}
