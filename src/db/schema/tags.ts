import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
    id: uuid("id").primaryKey().defaultRandom(),
    tag: varchar("tag", { length: 50 }).notNull().unique(),
});

export const bookTags = pgTable("bookTags", {
    tagId: uuid("tag_id").notNull(),
    bookId: uuid("book_id").notNull(),
});