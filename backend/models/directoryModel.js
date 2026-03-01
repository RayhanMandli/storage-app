import { Schema, model } from "mongoose";

const directorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  size:{
    type: Number,
    default: 0
  },
  parentDirId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "Directory",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  path:{
    type: [Schema.Types.ObjectId],
    ref: "Directory",
    default: []
  }
}, { timestamps: true });

export const Directory = model("Directory", directorySchema);
