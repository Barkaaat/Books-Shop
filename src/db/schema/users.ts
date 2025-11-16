import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    fullName: varchar("name", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updateddAt: timestamp("updated_at").notNull().defaultNow(),
});