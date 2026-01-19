const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { getRoom } = require("./rooms");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  const room = getRoom("default");

  socket.on("stroke:live", (data) => {
    socket.broadcast.emit("stroke:live", data);
  });

  socket.on("stroke:start", (data) => {
    room.startStroke(data);
  });

  socket.on("stroke:point", (p) => {
    room.addPoint(p);
  });

  socket.on("stroke:end", () => {
    room.endStroke();
    io.emit("canvas:update", room.getStrokes());
  });

  socket.on("undo", () => {
    room.undo();
    io.emit("canvas:update", room.getStrokes());
  });

  socket.on("redo", () => {
    room.redo();
    io.emit("canvas:update", room.getStrokes());
  });

  socket.on("clear", () => {
    room.clear();
    io.emit("canvas:update", room.getStrokes());
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
