import { db } from "../../config/db.js";
import { categories } from "../../db/schema/categories.js";
import { eq } from "drizzle-orm";

export class CategoryService {
    static async createCategory(category: string) {
        const existing = await db
            .select()
            .from(categories)
            .where(eq(categories.category, category));

        if (existing.length > 0) {
            return { error: "Category already exists", status: 409 };
        }

        const created = await db
            .insert(categories)
            .values({ category })
            .returning();

        return { data: created[0], status: 201 };
    }

    static async getAllCategories() {
        const data = await db
            .select()
            .from(categories);

        return { data, status: 200 };
    }

    static async getCategoryById(id: string) {
        const found = await db
            .select()
            .from(categories)
            .where(eq(categories.id, id));

        if (found.length === 0) {
            return { error: "Category not found", status: 404 };
        }

        return { data: found[0], status: 200 };
    }
}
