import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module used by your service.
// Relative path from test/categories -> src/config/db.js
vi.mock("../../src/config/db.js", () => {
  // helper to produce a "select builder"
  const makeSelectBuilder = (resolvedValue: any[]) => ({
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(resolvedValue),
    // other chainable helpers (not used in these tests but safe to have)
    groupBy: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
  });

  // helper to produce an "insert builder"
  const makeInsertBuilder = (returned: any[]) => ({
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue(returned),
  });

  return {
    db: {
      // these are replaced in each test via mockImplementation if needed
      select: vi.fn(() => makeSelectBuilder([])),
      insert: vi.fn(() => makeInsertBuilder([])),
      update: vi.fn(() => ({ set: vi.fn().mockReturnThis(), where: vi.fn().mockReturnThis(), returning: vi.fn().mockResolvedValue([]) })),
      delete: vi.fn(() => ({ where: vi.fn().mockReturnThis() })),
    },
  };
});

import { db } from "../../src/config/db.js";
import { CategoryService } from "../../src/features/categories/category.service.js";

describe("CategoryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new category", async () => {
    // Simulate no existing category
    const selectBuilder = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    };
    (db.select as any).mockImplementation(() => selectBuilder);

    // When inserting, return created row
    const insertBuilder = {
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: "cat-123", category: "Tech" }]),
    };
    (db.insert as any).mockImplementation(() => insertBuilder);

    const res = await CategoryService.createCategory("Tech");

    expect(res.status).toBe(201);
    expect(res.data).toBeDefined();
    expect(res.data?.category).toBe("Tech");

    // ensure select and insert were called
    expect(db.select).toHaveBeenCalled();
    expect(db.insert).toHaveBeenCalled();
    expect(insertBuilder.returning).toHaveBeenCalled();
  });

  it("should NOT create category if it already exists", async () => {
    // Simulate existing category found
    const selectBuilder = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([{ id: "cat-123", category: "Tech" }]),
    };
    (db.select as any).mockImplementation(() => selectBuilder);

    const res = await CategoryService.createCategory("Tech");

    expect(res.status).toBe(409);
    expect(res.error).toBe("Category already exists");
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("should return all categories", async () => {
    // Simulate select().from(...) returning rows
    const selectAll = {
      from: vi.fn().mockResolvedValue([
        { id: "1", category: "Drama" },
        { id: "2", category: "Action" },
      ]),
    };
    (db.select as any).mockImplementation(() => selectAll as any);

    const res = await CategoryService.getAllCategories();

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBe(2);
  });

  it("should return category by id", async () => {
    const selectBuilder = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([{ id: "cat-1", category: "Drama" }]),
    };
    (db.select as any).mockImplementation(() => selectBuilder);

    const res = await CategoryService.getCategoryById("cat-1");

    expect(res.status).toBe(200);
    expect(res.data?.category).toBe("Drama");
  });

  it("should return 404 if category not found", async () => {
    const selectBuilder = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    };
    (db.select as any).mockImplementation(() => selectBuilder);

    const res = await CategoryService.getCategoryById("unknown-id");

    expect(res.status).toBe(404);
    expect(res.error).toBe("Category not found");
  });
});
