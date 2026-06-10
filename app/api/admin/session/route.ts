import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

// Залогинен ли админ — для показа кнопки входа в админку в хедере.
export async function GET() {
  return NextResponse.json({ isAdmin: await isAdmin() });
}
