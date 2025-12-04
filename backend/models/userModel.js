import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    role: {
        type: String,
        enum: ["user", "admin", "manager", "owner"],
        default: "user",
    },
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        minLength: 4,
    },
    rootDirId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Directory",
    },
    googleDrive: {
        access_token: { type: String, default: null },
        refresh_token: { type: String, default: null },
        expires_at: { type: Number, default: null },
        scope: { type: String, default: null },
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

// Hashing password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = model("User", userSchema);
