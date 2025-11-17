import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    category: varchar("category", { length: 50 }).notNull().unique(),
});