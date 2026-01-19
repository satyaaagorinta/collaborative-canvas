function createDrawingState() {
  let strokes = [];
  let redoStack = [];
  let currentStroke = null;

  return {
    startStroke(data) {
      currentStroke = {
        tool: data.tool,
        color: data.color,
        size: data.size,
        points: []
      };
    },

    addPoint(point) {
      if (currentStroke) {
        currentStroke.points.push(point);
      }
    },

    endStroke() {
      if (!currentStroke) return;
      strokes.push(currentStroke);
      redoStack = [];
      currentStroke = null;
    },

    undo() {
      if (strokes.length === 0) return;
      redoStack.push(strokes.pop());
    },

    redo() {
      if (redoStack.length === 0) return;
      strokes.push(redoStack.pop());
    },

    clear() {
      strokes = [];
      redoStack = [];
    },

    getStrokes() {
      return strokes;
    }
  };
}

module.exports = createDrawingState;
