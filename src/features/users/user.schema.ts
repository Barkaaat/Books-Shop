import { z } from 'zod';

export const updateUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(4, { message: 'Username must be at least 4 characters' })
        .max(50, { message: 'Username must be less than 50 characters' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
        .optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    fullName: z
        .string()
        .trim()
        .min(3, { message: 'Full name must be at least 3 characters' })
        .max(50, { message: 'Full name must be less than 50 characters' })
        .optional(),
});