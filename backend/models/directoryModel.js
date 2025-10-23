import { Schema, model } from "mongoose";

const directorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  parentDirId: {
    type: Schema.Types.ObjectId,
    default: null,
    required: true,
    ref: "Directory",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const Directory = model("Directory", directorySchema);
