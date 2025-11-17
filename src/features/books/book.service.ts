import { db } from "../../config/db.js";
import { books } from "../../db/schema/books.js";
import { eq, inArray, like, asc, desc, and, gte, lte, count } from "drizzle-orm";
import { bookTags } from "../../db/schema/tags.js";

export class BookService {
    static async createBook(data: {
        title: string;
        price: number;
        thumbnail?: string;
        categoryId: string;
        authorId: string;
        tags?: string[];
    }) {
        const inserted = await db
            .insert(books)
            .values({
                title: data.title,
                price: data.price.toString(),
                thumbnail: data.thumbnail,
                categoryId: data.categoryId,
                authorId: data.authorId
            })
            .returning();

        const book = inserted[0];

        // Insert tags if provided
        if (data.tags && data.tags.length > 0) {
            const tagLinks = data.tags.map(tagId => ({
                bookId: book.id,
                tagId
            }));

            await db.insert(bookTags).values(tagLinks);
        }

        return { data: book, status: 201 };
    }

    static async getMyBooks(authorId: string, options: {
        page: number;
        limit: number;
        search?: string;
        sort?: "asc" | "desc";
        sortBy?: string;
        categoryId?: string;
        minPrice?: number;
        maxPrice?: number;
    }) {
        const { page, limit, search, sort, sortBy, categoryId, minPrice, maxPrice } = options;

        const offset = (page - 1) * limit;

        const whereConditions = [eq(books.authorId, authorId)];
        if (search) {
            whereConditions.push(like(books.title, `%${search}%`));
        }
        if (categoryId) {
            whereConditions.push(eq(books.categoryId, categoryId));
        }
        if (minPrice !== undefined) {
            whereConditions.push(gte(books.price, minPrice.toString()));
        }
        if (maxPrice !== undefined) {
            whereConditions.push(lte(books.price, maxPrice.toString()));
        }

        const column = sortBy === "title" ? books.title : 
                        sortBy === "price" ? books.price : books.createdAt;
        const orderBy =
            sort === "desc" ? desc(column) : asc(column);

        const data = await db
            .select()
            .from(books)
            .where(whereConditions.length ? and(...whereConditions) : undefined)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);

        const total = await db
            .select({ count: count() })
            .from(books)
            .where(whereConditions.length ? and(...whereConditions) : undefined);

        return {
            data,
            pagination: {
                total: Number(total[0]?.count || 0),
                page,
                limit,
                pages: Math.ceil(Number(total[0]?.count || 0) / limit)
            }
        };
    }

    static async getAllBooks(options: {
        page: number;
        limit: number;
        search?: string;
        sort?: "asc" | "desc";
        sortBy?: string;
        categoryId?: string;
        minPrice?: number;
        maxPrice?: number;
    }) {
        const { page, limit, search, sort, sortBy, categoryId, minPrice, maxPrice } = options;

        const offset = (page - 1) * limit;

        const whereConditions = [];
        if (search) {
            whereConditions.push(like(books.title, `%${search}%`));
        }
        if (categoryId) {
            whereConditions.push(eq(books.categoryId, categoryId));
        }
        if (minPrice !== undefined) {
            whereConditions.push(gte(books.price, minPrice.toString()));
        }
        if (maxPrice !== undefined) {
            whereConditions.push(lte(books.price, maxPrice.toString()));
        }

        const column = sortBy === "title" ? books.title : 
                        sortBy === "price" ? books.price : books.createdAt;
        const orderBy =
            sort === "desc" ? desc(column) : asc(column);

        const data = await db
            .select()
            .from(books)
            .where(whereConditions.length ? and(...whereConditions) : undefined)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);

        const total = await db
            .select({ count: count() })
            .from(books)
            .where(whereConditions.length ? and(...whereConditions) : undefined);

        return {
            data,
            pagination: {
                total: Number(total[0]?.count || 0),
                page,
                limit,
                pages: Math.ceil(Number(total[0]?.count || 0) / limit)
            }
        };
    }

    static async getBookById(id: string) {
        const found = await db
            .select()
            .from(books)
            .where(eq(books.id, id));

        if (found.length === 0) {
            return { error: "Book not found", status: 404 };
        }

        return { data: found[0], status: 200 };
    }

    static async updateBook(authorId: string, id: string, data: {
        title?: string;
        price?: number;
        thumbnail?: string;
        categoryId?: string;
    }) {
        const found = await db
            .select()
            .from(books)
            .where(eq(books.id, id));

        if (found.length === 0) {
            return { error: "Book not found", status: 404 };
        }

        if (authorId !== found[0].authorId) {
            return { error: "Only Author can edit book", status: 401 };
        }

        const updated = await db
            .update(books)
            .set({
                ...(data.title !== undefined && { title: data.title }),
                ...(data.price !== undefined && { price: data.price.toString() }),
                ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
                ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
                updateddAt: new Date()
            })
            .where(eq(books.id, id))
            .returning();

        return { data: updated[0], status: 200 };
    }

    static async deleteBook(authorId: string, id: string) {
        const found = await db
            .select()
            .from(books)
            .where(eq(books.id, id));

        if (found.length === 0) {
            return { error: "Book not found", status: 404 };
        }

        if (found[0].authorId !== authorId) {
            return { error: "Only Author can delete book", status: 401 };
        }

        await db
            .delete(books)
            .where(eq(books.id, id));

        return { data: `Book with id ${id} deleted successfully`, status: 200 };
    }
}
