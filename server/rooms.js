const createDrawingState = require("./drawing-state");

const rooms = {};

function getRoom(roomId = "default") {
  if (!rooms[roomId]) {
    rooms[roomId] = createDrawingState();
  }
  return rooms[roomId];
}

module.exports = { getRoom };
