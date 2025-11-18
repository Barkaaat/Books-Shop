import { z } from 'zod';

export const createCategorySchema = z.object({
    category: z
        .string()
        .min(1, 'Category name is required')
        .max(255, 'Category name must be less than 255 characters'),
});