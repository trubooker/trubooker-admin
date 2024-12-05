// app/api/socket/route.ts
import { NextResponse } from "next/server";
import { Server } from "socket.io";

let io: Server | null = null;

const handler = async (req: Request) => {
  if (!io) {
    const { server } = (globalThis as any).__NEXT_APP_HTTP_SERVER || {};
    if (!server) {
      return new NextResponse("Server unavailable", { status: 500 });
    }

    // Initialize Socket.IO server
    io = new Server(server);

    io.on("connection", (socket) => {
      console.log("Client connected");

      // Example of emitting messages from the server
      socket.emit("welcome", "Hello, Client!");

      // Simulating a moving driver with location updates every 2 seconds
      const interval = setInterval(() => {
        const fakeDriverLocation = {
          latitude: 9.07226 + Math.random() * 0.01,
          longitude: 7.49508 + Math.random() * 0.01,
          timestamp: new Date().toISOString(),
        };
        socket.emit("driverLocation", fakeDriverLocation);
      }, 2000);

      // // Fetch data from an external server
      // const fetchDriverLocation = async () => {
      //   try {
      //     const response = await fetch(
      //       "https://api.example.com/driver-location"
      //     ); // Replace with your actual API endpoint
      //     if (response.ok) {
      //       const driverLocation = await response.json();
      //       socket.emit("driverLocation", driverLocation);
      //     } else {
      //       console.error("Failed to fetch driver location:", response.status);
      //     }
      //   } catch (error) {
      //     console.error("Error fetching driver location:", error);
      //   }
      // };

      // // Simulate fetching driver location every 2 seconds
      // const interval = setInterval(() => {
      //   fetchDriverLocation();
      // }, 2000);

      // Clean up when the client disconnects
      socket.on("disconnect", () => {
        clearInterval(interval);
        console.log("Client disconnected");
      });
    });
  }

  return NextResponse.json({ message: "Socket server initialized" });
};

export const GET = handler;
