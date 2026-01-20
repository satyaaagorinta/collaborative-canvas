import { drawLine, redrawCanvas } from "./canvas.js";

export function initSocket(ctx) {
  const socket = io("https://collaborative-canvas-production-cfb9.up.railway.app");

  socket.on("stroke:live", (data) => {
    drawLine(
      ctx,
      data.x1,
      data.y1,
      data.x2,
      data.y2,
      data.tool === "eraser" ? "white" : data.color,
      data.size
    );
  });

  socket.on("canvas:update", (strokes) => {
    redrawCanvas(ctx, strokes);
  });

  return socket;
}
