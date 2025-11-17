import type { Context } from "hono";
import { createBookSchema, updateBookSchema } from "./book.schema.js";
import { BookService } from "./book.service.js";

export class BookController {
    static async createBook(c: Context) {
        try {
            const authorId = c.get("user").id;
            const body = await c.req.json();

            const parsed = createBookSchema.safeParse(body);
            if (!parsed.success) {
                return c.json({ error: parsed.error.issues }, 400);
            }

            const { title, price, thumbnail, categoryId, tags } = parsed.data;

            const result = await BookService.createBook({
                title,
                price,
                thumbnail,
                categoryId,
                authorId,
                tags
            });

            return c.json({ message: "Book created successfully", book: result.data }, 201);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Internal server error" }, 500);
        }
    }

    static async getMyBooks(c: Context) {
        try {
            const user = c.get("user");
            const query = c.req.query();

            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 10;

            const search = query.search || undefined;
            const sort = query.sort === "desc" ? "desc" : "asc";
            const sortBy = query.sortBy || "title"
            const categoryId = query.categoryId || undefined;
            const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
            const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

            const result = await BookService.getMyBooks(user.id, {
                page,
                limit,
                search,
                sort,
                sortBy,
                categoryId,
                minPrice,
                maxPrice,
            });

            return c.json(result, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to fetch books" }, 500);
        }
    }

    static async getAllBooks(c: Context) {
        try {
            const query = c.req.query();

            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 10;

            const search = query.search || undefined;
            const sort = query.sort === "desc" ? "desc" : "asc";
            const sortBy = query.sortBy || "title"
            const categoryId = query.categoryId || undefined;
            const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
            const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

            const result = await BookService.getAllBooks({
                page,
                limit,
                search,
                sort,
                sortBy,
                categoryId,
                minPrice,
                maxPrice,
            });

            return c.json(result, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to fetch books" }, 500);
        }
    }

    static async getBookById(c: Context) {
        try {
            const id = c.req.param("id");

            if (!id) {
                return c.json({ error: "Book ID is required" }, 400);
            }

            const result = await BookService.getBookById(id);

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json(result.data, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to fetch book" }, 500);
        }
    }

    static async updateBook(c: Context) {
        try {
            const user = c.get("user");
            const id = c.req.param("id");

            const body = await c.req.json();
            const parsed = updateBookSchema.safeParse(body);

            if (!parsed.success) {
                return c.json({ error: parsed.error.flatten() }, 400);
            }

            const result = await BookService.updateBook(user.id, id, parsed.data);

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json(result.data, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to update book" }, 500);
        }
    }

    static async deleteBook(c: Context) {
        try {
            const user = c.get("user");
            const id = c.req.param("id");

            const result = await BookService.deleteBook(user.id, id);

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json({ message: result.data }, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Failed to delete book" }, 500);
        }
    }
}