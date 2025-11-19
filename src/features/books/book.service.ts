import { db } from "../../config/db.js";
import { books } from "../../db/schema/books.js";
import { users } from "../../db/schema/users.js";
import { tags } from "../../db/schema/tags.js";
import { categories } from "../../db/schema/categories.js";
import { bookTags } from "../../db/schema/tags.js";
import { eq, like, asc, desc, and, gte, lte, count, sql } from "drizzle-orm";

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
        .select({
            id: books.id,
            title: books.title,
            price: books.price,
            thumbnail: books.thumbnail,
            craetedAt: books.createdAt,
            updatedAt: books.updatedAt,

            // Author
            authorId: books.authorId,
            author: users.fullName,

            // Category
            category: categories.category,

            // Tags
            tags: sql`COALESCE(array_agg(${tags.tag}), '{}')`.as("tags"),
        })
        .from(books)
        .leftJoin(users, eq(books.authorId, users.id))
        .leftJoin(categories, eq(books.categoryId, categories.id))
        .leftJoin(bookTags, eq(books.id, bookTags.bookId))
        .leftJoin(tags, eq(bookTags.tagId, tags.id))
        .where(whereConditions.length ? and(...whereConditions) : undefined)
        .groupBy(
            books.id,
            users.fullName,
            categories.category
        )
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
        .select({
            id: books.id,
            title: books.title,
            price: books.price,
            thumbnail: books.thumbnail,
            craetedAt: books.createdAt,
            updatedAt: books.updatedAt,

            // Author
            authorId: books.authorId,
            author: users.fullName,

            // Category
            category: categories.category,

            // Tags
            tags: sql`COALESCE(array_agg(${tags.tag}), '{}')`.as("tags"),
        })
        .from(books)
        .leftJoin(users, eq(books.authorId, users.id))
        .leftJoin(categories, eq(books.categoryId, categories.id))
        .leftJoin(bookTags, eq(books.id, bookTags.bookId))
        .leftJoin(tags, eq(bookTags.tagId, tags.id))
        .where(whereConditions.length ? and(...whereConditions) : undefined)
        .groupBy(
            books.id,
            users.fullName,
            categories.category
        )
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
                updatedAt: new Date()
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
