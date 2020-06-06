import mongoose from "mongoose";
const Schema = mongoose.Schema;

// create schema
const BoardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  index: {
    type: String,
    required: true,
  },
});

BoardSchema.methods.toJSON = function () {
  return {
    id: this._id,
    title: this.title,
    index: this.index,
  };
};
mongoose.model("boards", BoardSchema);
