// app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear the authToken and userData cookies
  cookies().set({
    name: "authToken",
    value: "",
    maxAge: -1, // Deletes the cookie
    path: "/",
  });

  return NextResponse.json({ message: "Logged out successfully" });
}
