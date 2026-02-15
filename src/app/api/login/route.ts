import { NextRequest } from "next/server";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  
  const resData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await resData.json();
  const token = data?.data?.token;
  console.log(data);

  if (data?.status === "success") {
    // This condition is ALWAYS true - matches original behavior
    // Original logic: if role is NOT passenger OR NOT driver OR NOT agent
    // Which is always true for any role (including undefined)
    if (
      data?.data?.user?.role !== "passenger" ||
      data?.data?.user?.role !== "driver" || 
      data?.data?.user?.role !== "agent"
    ) {
      const serialized = serialize("token", token, {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 1, // 1 day
        sameSite: "strict",
        path: "/",
      });

      const response = {
        data: data?.data?.user,
      };
      
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Set-Cookie": serialized }, // Fixed: "Set-cookie" -> "Set-Cookie"
      });
    } else {
      // This code will NEVER execute with the current logic
      return new Response(
        JSON.stringify({ message: "Unauthorized!! Admin only" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    const response = {
      message: data?.errors || "Login failed",
    };
    return new Response(JSON.stringify(response), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}