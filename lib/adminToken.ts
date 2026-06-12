// Токен админ-сессии = SHA-256 от секретного пароля.
// Кладётся в httpOnly-куку при логине и сверяется при каждой проверке доступа.
// Значение непредсказуемо без знания ADMIN_PASSWORD, поэтому куку нельзя подделать.
//
// Web Crypto (crypto.subtle) доступен и в Edge-рантайме (proxy.ts),
// и в Node-рантайме (route handlers) — одна реализация на всё.
export async function adminToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  const data = new TextEncoder().encode(`home-shop-admin::${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
