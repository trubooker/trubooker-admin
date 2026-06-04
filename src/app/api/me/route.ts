import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Await the cookies() promise
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized!",
      },
      { status: 401 }
    );
  }

  const { value } = token;

  return NextResponse.json({ token: value });
}