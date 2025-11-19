import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("../../src/config/db.js", () => ({
  db: {
    insert: vi.fn(() => ({ values: vi.fn().mockReturnThis(), returning: vi.fn().mockResolvedValue([]) })),
    select: vi.fn(() => ({ from: vi.fn().mockReturnThis(), where: vi.fn().mockResolvedValue([]) })),
  },
}));

import { db } from "../../src/config/db.js";
import { TagService } from "../../src/features/tags/tag.service.js";

describe("TagService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new tag", async () => {
    const returning = [{ id: "tag-1", tag: "Tech" }];
    (db.insert as any).mockImplementation(() => ({
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue(returning),
    }));

    const res = await TagService.createTag("Tech");

    expect(res.status).toBe(201);
    expect(res.data).toEqual({ id: "tag-1", tag: "Tech" });
    expect(db.insert).toHaveBeenCalled();
  });

  it("should return all tags", async () => {
    const selectAll = { from: vi.fn().mockResolvedValue([{ id: "1", tag: "Drama" }]) };
    (db.select as any).mockImplementation(() => selectAll as any);

    const res = await TagService.getTags();

    expect(res.status).toBe(200);
    expect(res.data).toEqual([{ id: "1", tag: "Drama" }]);
    expect(db.select).toHaveBeenCalled();
  });

  it("should return tag by ID", async () => {
    const selectBuilder = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([{ id: "1", tag: "Drama" }]),
    };
    (db.select as any).mockImplementation(() => selectBuilder);

    const res = await TagService.getTagById("1");

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ id: "1", tag: "Drama" });
  });

  it("should return 404 if tag not found", async () => {
    const selectBuilder = { from: vi.fn().mockReturnThis(), where: vi.fn().mockResolvedValue([]) };
    (db.select as any).mockImplementation(() => selectBuilder);

    const res = await TagService.getTagById("unknown");

    expect(res.status).toBe(404);
    expect(res.error).toBe("Tag not found");
  });
});
