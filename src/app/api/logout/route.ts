// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Await the cookies() promise first
  const cookieStore = await cookies();
  
  // Then set the cookie
  cookieStore.set({
    name: "token",
    value: "",
    maxAge: -1, // Deletes the cookie
    path: "/",
  });

  return NextResponse.json({ message: "Logged out successfully" });
}