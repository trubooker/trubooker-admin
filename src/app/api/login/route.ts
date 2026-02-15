import { NextResponse, NextRequest } from "next/server";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  try {
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

    // Check if login was successful
    if (data?.status === "success") {
      // Check user role - fix the logic here
      const userRole = data?.data?.user?.role;
      
      // Allow admin, agent, and driver? Your condition seems reversed
      // Original: if role is NOT passenger OR NOT driver OR NOT agent (this is always true)
      // Let's clarify what roles should be allowed
      if (userRole === "admin" || userRole === "agent" || userRole === "driver") {
        
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
          headers: { "Set-Cookie": serialized }, // Fixed header name (capital C)
        });
      } else {
        return new Response(
          JSON.stringify({ message: "Unauthorized!! Admin only" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ message: data?.errors || "Login failed" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}