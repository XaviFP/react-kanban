import WebSocket from "ws";

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

// Websockets
export const sockets = {};

wss.on("connection", function (ws, request) {
  console.log("user");
  if (request.session) {
    const userId = request.session.userId;
    console.log("Connected", userId);
    sockets[userId] = ws;
    ws.emit(userId);
  } else {
    ws.close();
  }
});
export default wss;
