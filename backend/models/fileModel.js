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
        cloudinaryPublicId: {
            type: String,
            default: null,
            
        },
        url:{
            type: String,
            default: null,
        },
        filesize: {
            type: Number,
            required: true,
            min:0,
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
        sharedWith: {
            type: [
                {
                    userId: {
                        type: Schema.Types.ObjectId,
                        ref: "User",
                        required: true, // Often subdocument fields require values
                    },
                    permissions: {
                        type: String,
                        enum: ["viewer", "editor"],
                        default: "viewer", // You can set defaults within the subdoc too
                    },
                    sharedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            // Set the default for the main 'sharedWith' array field:
            default: [],
        },
        linkShare: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const File = model("File", fileSchema);
