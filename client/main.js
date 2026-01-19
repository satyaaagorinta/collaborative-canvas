import { initSocket } from "./websocket.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const brushBtn = document.getElementById("brushBtn");
const eraserBtn = document.getElementById("eraserBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const clearBtn = document.getElementById("clearBtn");

let tool = "brush";
let drawing = false;
let lastPoint = null;

const socket = initSocket(ctx);

brushBtn.onclick = () => tool = "brush";
eraserBtn.onclick = () => tool = "eraser";

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  lastPoint = { x: e.offsetX, y: e.offsetY };

  socket.emit("stroke:start", {
    tool,
    color: colorPicker.value,
    size: brushSize.value
  });

  socket.emit("stroke:point", lastPoint);
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const newPoint = { x: e.offsetX, y: e.offsetY };

  // local preview
  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(newPoint.x, newPoint.y);
  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";
  ctx.strokeStyle = tool === "eraser" ? "white" : colorPicker.value;
  ctx.stroke();

  socket.emit("stroke:live", {
    x1: lastPoint.x,
    y1: lastPoint.y,
    x2: newPoint.x,
    y2: newPoint.y,
    color: colorPicker.value,
    size: brushSize.value,
    tool
  });

  socket.emit("stroke:point", newPoint);
  lastPoint = newPoint;
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  socket.emit("stroke:end");
});

undoBtn.onclick = () => socket.emit("undo");
redoBtn.onclick = () => socket.emit("redo");
clearBtn.onclick = () => socket.emit("clear");
