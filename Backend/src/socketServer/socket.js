import { Server } from "socket.io";
let io = null;
export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    // Client wants all live match updates
    socket.on("joinLive", () => {
      socket.join("live");
      console.log(`📺 ${socket.id} joined [live] room`);
    });

    // Client wants updates for a specific fixture
    socket.on("joinMatch", (fixtureId) => {
      const room = `fixture_${fixtureId}`;
      socket.join(room);
      console.log(`📺 ${socket.id} joined room [${room}]`);
    });

    socket.on("leaveMatch", (fixtureId) => {
      socket.leave(`fixture_${fixtureId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
  return io;
}
export function getIO() {
  if (!io) throw new Error("Socket.io not initialised yet");
  return io;
}