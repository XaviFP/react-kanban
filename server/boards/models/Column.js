import mongoose from "mongoose";
const Schema = mongoose.Schema;

// create schema
const ColumnSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  index: {
    type: String,
    required: true,
  },
  boardId: {
    type: String,
    required: true,
  },
});

ColumnSchema.methods.toJSON = function () {
  return {
    id: this._id,
    title: this.title,
    index: this.index,
    boardId: this.boardId,
  };
};

mongoose.model("columns", ColumnSchema);
