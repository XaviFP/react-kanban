import express from "express";
import fs from "fs";
const router = express.Router();
import mongoose from "mongoose";
import "./models/Board.js";
const Board = mongoose.model("boards");
import * as boardService from "./service.js";
import { sockets } from "../webSocketServer.js";
import SchemaValidator from "./schemaValidator.js";
const validateRequest = SchemaValidator(true);

router.use(async function timeLog(req, res, next) {
  console.log("Time of request: ", Date(Date.now()));
  console.log("USER ID: ", req.session.userId);
  next();
});

// router.use(async function timeLog(req, res, next) {
//   console.log("Time of request: ", Date(Date.now()));
//   console.log("USER ID: ", req.session.userId);
//   next();
// });

/////////////////// BOARDS ///////////////////

router.post("/", validateRequest, async (req, res) => {
  console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
  const payload = req.body;
  payload.dispatch = true;

  // const validationErrors = validate(payload);
  // if (validationErrors) {
  //   res.send(validationErrors);
  //   return;
  // }
  const result = await boardService.process(payload);
  console.log("REQUEST WAS SUCCESSFUL", result);
  res.send(result);
  console.log("REQUEST USER ID", req.session.userId);
  for (let [userId, socket] of Object.entries(sockets)) {
    if (req.session.userId !== userId) {
      console.log("SENT WEBSOCKET PAYLOAD TO USER ID:", userId);
      socket.send(JSON.stringify(result));
    }
  }
});

router.get("/", async (req, res) => {
  const data = await boardService.getAll();
  res.send(data);
});

export default router;
