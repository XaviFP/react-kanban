import express from "express";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log("Time of session request: ", Date(Date.now()));
  next();
});

router.get("/", (req, res) => {
  if (!req.session.userId) {
    const id = uuidv4();
    console.log(`Updating session for user ${id}`);
    req.session.userId = id;
  }

  res.send({ result: "OK", message: "Session updated" });
});

export default router;
