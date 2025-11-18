import { db } from "../../config/db.js";
import { tags } from "../../db/schema/tags.js";
import { eq } from "drizzle-orm";

export class TagService {
    static async createTag(name: string) {
        const inserted = await db
            .insert(tags)
            .values({ tag: name })
            .returning();

        return { data: inserted[0], status: 201 };
    }

    static async getTags() {
        const all = await db.select().from(tags);

        return { data: all, status: 200 };
    }

    static async getTagById(id: string) {
        const found = await db
            .select()
            .from(tags)
            .where(eq(tags.id, id));

        if (found.length === 0) {
            return { error: "Tag not found", status: 404 };
        }

        return { data: found[0], status: 200 };
    }
}
