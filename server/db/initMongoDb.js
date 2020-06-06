"use-strict";
import mongoose from "mongoose";
import "../boards/models/Board.js";
const Board = mongoose.model("boards");
import "../boards/models/Column.js";
const Column = mongoose.model("columns");
import "../boards/models/Task.js";
const Task = mongoose.model("tasks");

export async function initDb() {
  const numberOfBoards = await Board.countDocuments({});
  if (numberOfBoards > 0) return;
  await Task.collection.drop({}, function (err) {
    console.log("collection removed");
  });

  await Column.collection.drop({}, function (err) {
    console.log("collection removed");
  });

  await Board.collection.drop({}, function (err) {
    console.log("collection removed");
  });
  const boardTitle = "Board";
  const index = await Board.countDocuments({});
  const newBoard = await new Board({
    title: boardTitle,
    index: index.toString(),
  })
    .save()
    .then((board) => board.toJSON());

  for (const [index, title] of [
    "To do",
    "In progress",
    "In review",
    "Done",
  ].entries()) {
    await new Column({
      title: title,
      index: index,
      boardId: newBoard.id,
    }).save();
  }
}
