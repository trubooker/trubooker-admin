// app/api/socket/route.ts
import { NextResponse } from "next/server";
import { Server } from "socket.io";
import { IncomingMessage } from "http";
import { Duplex } from "stream";

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

// import { IncomingMessage } from "http";
// import { Duplex } from "stream";
// import { WebSocketServer } from "ws";

// // Variable to hold the WebSocket server
// let wss: WebSocketServer | null = null;

// // interface ExtendedSocket extends NodeJS.Socket {
// //   server: {
// //     _webSocketSetup?: boolean;
// //     on: (event: string, listener: (...args: any[]) => void) => void;
// //   };
// // }

// const handler = async (req: Request): Promise<Response> => {
//   if (!wss) {
//     // Attach WebSocket server to the global scope
//     const { server } = (globalThis as any).__NEXT_APP_HTTP_SERVER || {};
//     if (!server) {
//       console.error("HTTP server is not available");
//       return new Response("Server unavailable", { status: 500 });
//     }
//     // Initialize WebSocket server
//     wss = new WebSocketServer({ noServer: true });

//     wss.on("connection", (ws) => {
//       console.log("Client connected");

//       // Simulating a moving driver with location updates every 2 seconds
//       const interval = setInterval(() => {
//         const fakeDriverLocation = {
//           latitude: 9.07226 + Math.random() * 0.01, // Simulated latitude
//           longitude: 7.49508 + Math.random() * 0.01, // Simulated longitude
//           timestamp: new Date().toISOString(),
//         };
//         ws.send(JSON.stringify(fakeDriverLocation)); // Send the updated driver location
//       }, 2000);

//       // Clean up on client disconnect
//       ws.on("close", () => {
//         clearInterval(interval);
//         console.log("Client disconnected");
//       });
//     });
//     // Handle WebSocket upgrade
//     server.on(
//       "upgrade",
//       (req: IncomingMessage, socket: Duplex, head: Buffer) => {
//         wss?.handleUpgrade(req, socket, head, (ws) => {
//           wss?.emit("connection", ws, req);
//         });
//       }
//     );
//   }

//   return new Response(null, { status: 200 }); // Return an empty response
// };

// export const GET = handler;
