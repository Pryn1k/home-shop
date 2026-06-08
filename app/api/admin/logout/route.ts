import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // удаляем куку авторизации (maxAge: 0 — браузер её сразу забывает)
  response.cookies.set("admin-auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
