import { z } from "zod";

export const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(4, { message: 'Username must be at least 4 characters' })
        .max(50, { message: 'Username must be less than 50 characters' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(50, { message: 'Password must be less than 50 characters' }),
    fullName: z
        .string()
        .trim()
        .min(3, { message: 'Full name must be at least 3 characters' })
        .max(50, { message: 'Full name must be less than 50 characters' }),
});

export const loginSchema = z.object({
    usernameOrEmail: z
        .string()
        .trim()
        .min(4, { message: 'Username or Email required' }),
    password: z
        .string()
        .min(1, { message: "Password required" })
});

export const changePasswordSchema = z.object({
    oldPassword: z
        .string()
        .min(1, { message: "Old password is required" }),

    newPassword: z
        .string()
        .min(8, { message: "New password must be at least 8 characters" })
        .max(50, { message: 'Password must be less than 50 characters' }),
});