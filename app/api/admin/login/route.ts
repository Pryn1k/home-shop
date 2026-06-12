import { NextResponse } from "next/server";
import { adminToken } from "@/lib/adminToken";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("admin-auth", await adminToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  }

  return NextResponse.json({
    success: false,
  });
}
