import { pgTable, uuid, varchar, decimal, timestamp } from 'drizzle-orm/pg-core';

export const books = pgTable('books', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    thumbnail: varchar('thumbnail', { length: 255 }),
    authorId: uuid('author_id').notNull(),
    categoryId: uuid('category_id').notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});