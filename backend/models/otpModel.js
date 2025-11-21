import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    otp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // OTP expires in 5 minutes
    },
});

export const Otp = model("Otp", otpSchema);
