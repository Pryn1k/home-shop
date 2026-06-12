import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminToken } from "@/lib/adminToken";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("admin-auth")?.value;
  const isAdmin = !!token && token === (await adminToken());

  const isLoginPage =
    req.nextUrl.pathname === "/admin/login";

  const isAdminRoute =
    req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isAdmin && !isLoginPage) {
    return NextResponse.redirect(
      new URL("/admin/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
