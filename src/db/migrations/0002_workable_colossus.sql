CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"thumbnail" varchar(255),
	"author_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(50) NOT NULL,
	CONSTRAINT "categories_category_unique" UNIQUE("category")
);
--> statement-breakpoint
CREATE TABLE "bookTags" (
	"tag_id" uuid NOT NULL,
	"book_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tag" varchar(50) NOT NULL,
	CONSTRAINT "tags_tag_unique" UNIQUE("tag")
);
