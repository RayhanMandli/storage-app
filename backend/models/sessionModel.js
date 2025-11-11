import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400,
    },
});

const Session = model("Session", sessionSchema);

export default Session;
