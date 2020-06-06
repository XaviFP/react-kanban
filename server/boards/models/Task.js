import mongoose from "mongoose";
const Schema = mongoose.Schema;

// create schema
const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  index: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  columnId: {
    type: String,
    required: true,
  },
  boardId: {
    type: String,
    required: true,
  },
});

TaskSchema.methods.toJSON = function () {
  return {
    id: this._id,
    title: this.title,
    index: this.index,
    columnId: this.columnId,
    boardId: this.boardId,
    tags: [],
    description: this.description ? this.description : "",
  };
};

mongoose.model("tasks", TaskSchema);
