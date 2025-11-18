import type { Context } from "hono";
import { TagService } from "./tag.service.js";
import { createTagSchema } from "./tag.schema.js";

export class TagController {
    static async createTag(c: Context) {
        try {
            const body = await c.req.json();

            const parsed = createTagSchema.safeParse(body);
            if (!parsed.success) {
                return c.json({ error: parsed.error.issues }, 400);
            }

            const { name } = parsed.data;

            const result = await TagService.createTag(name);

            return c.json({ data: result.data, message: "Tag created" }, 201);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to create tag" }, 500);
        }
    }

    static async getTags(c: Context) {
        try {
            const result = await TagService.getTags();

            return c.json(result.data, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to fetch tags" }, 500);
        }
    }

    static async getTagById(c: Context) {
        try {
            const id = c.req.param("id");

            const result = await TagService.getTagById(id);

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json({ tag: result.data }, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to fetch tag" }, 500);
        }
    }
}
