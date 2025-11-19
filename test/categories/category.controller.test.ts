import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the service used by the controller
vi.mock("../../src/features/categories/category.service.js", () => ({
  CategoryService: {
    createCategory: vi.fn(),
    getAllCategories: vi.fn(),
    getCategoryById: vi.fn(),
  },
}));

import { CategoryController } from "../../src/features/categories/category.controller.js";
import { CategoryService } from "../../src/features/categories/category.service.js";

// small helper to build a fake Hono-like Context used by your controller
function makeCtx(
  { body = null, params = {}, query = {} }: { body?: any; params?: Record<string, any>; query?: Record<string, any> } = {}
) {
  return {
    req: {
      json: async () => body,
      param: (k: string) => (params as any)[k],
      query: () => query,
    },
    // c.get/c.set used in other controllers; categories controller doesn't use user
    get: (k: string) => undefined,
    set: (k: string, v: any) => {},
    json: vi.fn(),
  };
}

describe("CategoryController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new category", async () => {
    (CategoryService.createCategory as any).mockResolvedValue({
      status: 201,
      data: { id: "cat-123", category: "Tech" },
    });

    const ctx = makeCtx({ body: { category: "Tech" } });

    await CategoryController.createCategory(ctx as any);

    expect(CategoryService.createCategory).toHaveBeenCalledWith("Tech");
    expect(ctx.json).toHaveBeenCalledWith(
      { message: "Category created successfully", category: { id: "cat-123", category: "Tech" } },
      201
    );
  });

  it("should return validation error when body invalid", async () => {
    const ctx = makeCtx({ body: { category: "" } });

    // Call controller which will validate via zod and respond with 400
    await CategoryController.createCategory(ctx as any);

    expect(ctx.json).toHaveBeenCalledWith(expect.any(Object), 400);
    // Service should not be called on validation failure
    expect(CategoryService.createCategory).not.toHaveBeenCalled();
  });

  it("should return all categories", async () => {
    (CategoryService.getAllCategories as any).mockResolvedValue({
      status: 200,
      data: [
        { id: "1", category: "Drama" },
        { id: "2", category: "Books" },
      ],
    });

    const ctx = makeCtx();

    await CategoryController.getAllCategories(ctx as any);

    expect(CategoryService.getAllCategories).toHaveBeenCalled();
    expect(ctx.json).toHaveBeenCalledWith(
      [
        { id: "1", category: "Drama" },
        { id: "2", category: "Books" },
      ],
      200
    );
  });

  it("should return category by ID", async () => {
    (CategoryService.getCategoryById as any).mockResolvedValue({
      status: 200,
      data: { id: "1", category: "Drama" },
    });

    const ctx = makeCtx({ params: { id: "1" } });

    await CategoryController.getCategoryById(ctx as any);

    expect(CategoryService.getCategoryById).toHaveBeenCalledWith("1");
    expect(ctx.json).toHaveBeenCalledWith({ category: { id: "1", category: "Drama" } }, 200);
  });

  it("should return 404 when category not found", async () => {
    (CategoryService.getCategoryById as any).mockResolvedValue({
      status: 404,
      error: "Category not found",
    });

    const ctx = makeCtx({ params: { id: "missing" } });

    await CategoryController.getCategoryById(ctx as any);

    expect(ctx.json).toHaveBeenCalledWith({ error: "Category not found" }, 404);
  });
});
