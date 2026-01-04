import z from "zod"
export const fileAccessSchema = z.object({
    email: z.email("Invalid email address"),
})
export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
}).required()
export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
}).required()
export const sendOtpSchema = z.object({
    email: z.email("Invalid email address"),
}).required();
export const verifyOtpSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().length(4, "OTP must be 4 characters long"),
}).required()
