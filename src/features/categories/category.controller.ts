import type { Context } from "hono";
import { createCategorySchema } from "./category.schema.js";
import { CategoryService } from "./category.service.js";

export class CategoryController {
    static async createCategory(c: Context) {
        try {
            const body = await c.req.json();

            const parsed = createCategorySchema.safeParse(body);
            if (!parsed.success) {
                return c.json({ error: parsed.error.issues }, 400);
            }

            const { category } = parsed.data;

            const result = await CategoryService.createCategory(category);

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json({ message: "Category created successfully", category: result.data }, 201);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to create category" }, 500);
        }
    }

    static async getAllCategories(c: Context) {
        try {
            const result = await CategoryService.getAllCategories();
            return c.json(result.data, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to fetch categories" }, 500);
        }
    }

    static async getCategoryById(c: Context) {
        try {
            const id = c.req.param("id");

            const result = await CategoryService.getCategoryById(id);

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json({ category: result.data }, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to fetch category" }, 500);
        }
    }
}
