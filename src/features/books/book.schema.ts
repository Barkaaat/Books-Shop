import { z } from 'zod';

export const createBookSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters'),
    price: z
        .number()
        .positive('Price must be a positive number'),
    thumbnail: z
        .string()
        .url('Invalid thumbnail URL')
        .optional(),
    categoryId: z
        .string()
        .uuid('Invalid category ID'),
    tags: z
        .array(z.string().uuid('Invalid tag ID'))
        .optional(),
});