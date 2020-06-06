import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import http from "http";
import webSocketServer from "./webSocketServer.js";

export const app = express();
export const server = http.createServer(app);

const sessionParser = session({
  saveUninitialized: false,
  secret: "$eCuRiTy",
  resave: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionParser);

server.on("upgrade", function (request, socket, head) {
  console.log("Parsing session from request...");
  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      socket.destroy();
      return;
    }
    console.log("Session is parsed!");
    webSocketServer.handleUpgrade(request, socket, head, function (ws) {
      webSocketServer.emit("connection", ws, request);
    });
  });
});
