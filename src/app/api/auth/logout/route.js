import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/userMasterSession";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });
  clearSessionCookie(response);
  return response;
}
