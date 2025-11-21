import { Resend } from "resend";
import { Otp } from "../models/otpModel.js";
const resend = new Resend("re_Y8rHQz1i_AmFLoySgHyqrdmd53hXf7MyX");
export const otpHandler = async (email) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    try {
        await resend.emails.send({
            from: "Storage App <otp@mandli.tech>",
            to: [email],
            subject: "OTP for Verification - Valid for 5 minutes",
            html: `<p>Your OTP for verification is: <strong>${otp}</strong></p><p>This OTP is valid for 5 minutes.</p>`,
        });
        await Otp.findOneAndUpdate(
            { email },
            { otp },
            { upsert: true, new: true }
        );
        return {
            success: true,
            otp,
        };
    } catch (err) {
        console.error("Error generating OTP:", err);
        return {
            success: false,
            message: "Error generating OTP",
        };
    }
};
