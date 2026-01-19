export function drawLine(ctx, x1, y1, x2, y2, color, size) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = size;
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function redrawCanvas(ctx, strokes) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let stroke of strokes) {
    const color =
      stroke.tool === "eraser" ? "white" : stroke.color;

    for (let i = 1; i < stroke.points.length; i++) {
      drawLine(
        ctx,
        stroke.points[i - 1].x,
        stroke.points[i - 1].y,
        stroke.points[i].x,
        stroke.points[i].y,
        color,
        stroke.size
      );
    }
  }
}
