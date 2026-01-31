const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Allows Qualtrics to connect
});

let waiting = [];
let dyads = {};

// Socket.io Connection Logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Users join a "room" based on their dyadId
  socket.on("join_room", (dyadId) => {
    socket.join(dyadId);
    console.log(`User joined room: ${dyadId}`);
  });

  // Listen for messages and broadcast to the room
  socket.on("send_message", (data) => {
    // data = { dyadId, role, text }
    io.to(data.dyadId).emit("receive_message", data);
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

// Keep your existing /register POST endpoint here...
// (Ensure it returns the dyadId to the client)

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));