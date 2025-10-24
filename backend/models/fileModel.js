import { Schema, model } from "mongoose";

const fileSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
      minLength: 3,
    },
    extension: {
      type: String,
      required: true,
      match: [/\.([a-zA-Z0-9]+)$/, "Invalid file extension"],
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Directory",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const File = model("File", fileSchema);
