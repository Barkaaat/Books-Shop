import { z } from 'zod';

export const createTagSchema = z.object({
    name: z
        .string()
        .min(1, 'Tag name is required')
        .max(255, 'Tag name must be less than 255 characters'),
});