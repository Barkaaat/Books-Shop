import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookController } from "../../src/features/books/book.controller.js";
import { BookService } from "../../src/features/books/book.service.js";

describe("BookController", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates book successfully", async () => {
    // Mock service
    vi.spyOn(BookService, "createBook").mockResolvedValue({
      data: { id: "book-123", title: "Book 1" },
    } as any);

    const validCategoryId = "550e8400-e29b-41d4-a716-446655440000";
    const validTagId = "660e8400-e29b-41d4-a716-446655440000";

    const jsonMock = vi.fn();

    const ctx: any = {
      req: {
        json: async () => ({
          title: "Book 1",
          price: 10,
          thumbnail: "https://example.com/img.jpg",
          categoryId: validCategoryId,
          tags: [validTagId],
        }),
      },
      get: () => ({ id: "user-123" }),
      json: jsonMock,
    };

    await BookController.createBook(ctx);

    expect(BookService.createBook).toHaveBeenCalledTimes(1);
  });

  it("fails validation if title is missing", async () => {
    // 🔥 mock service even if we expect it NOT to be called
    vi.spyOn(BookService, "createBook").mockResolvedValue({} as any);

    const jsonMock = vi.fn();

    const ctx: any = {
      req: {
        json: async () => ({
          price: 10,
          categoryId: "550e8400-e29b-41d4-a716-446655440000",
        }),
      },
      get: () => ({ id: "user-123" }),
      json: jsonMock,
    };

    await BookController.createBook(ctx);

    // Assert validation error
    expect(jsonMock).toHaveBeenCalledWith(expect.any(Object), 400);

    // Assert service NOT called
    expect(BookService.createBook).not.toHaveBeenCalled();
  });
});
