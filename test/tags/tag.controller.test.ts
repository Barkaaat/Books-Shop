import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the service used by the controller
vi.mock("../../src/features/tags/tag.service.js", () => ({
  TagService: {
    createTag: vi.fn(),
    getTags: vi.fn(),
    getTagById: vi.fn(),
  },
}));

import { TagController } from "../../src/features/tags/tag.controller.js";
import { TagService } from "../../src/features/tags/tag.service.js";

// Helper to build a fake Hono-like Context
function makeCtx({
  body = null,
  params = {},
}: { body?: any; params?: Record<string, any> } = {}) {
  return {
    req: {
      json: async () => body,
      param: (k: string) => (params as any)[k],
    },
    json: vi.fn(),
  };
}

describe("TagController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new tag", async () => {
    (TagService.createTag as any).mockResolvedValue({
      data: { id: "tag-1", tag: "Tech" },
      status: 201,
    });

    const ctx = makeCtx({ body: { name: "Tech" } });

    await TagController.createTag(ctx as any);

    expect(TagService.createTag).toHaveBeenCalledWith("Tech");
    expect(ctx.json).toHaveBeenCalledWith(
      { data: { id: "tag-1", tag: "Tech" }, message: "Tag created" },
      201
    );
  });

  it("should return validation error when body invalid", async () => {
    const ctx = makeCtx({ body: { name: "" } });

    await TagController.createTag(ctx as any);

    expect(ctx.json).toHaveBeenCalledWith(expect.any(Object), 400);
    expect(TagService.createTag).not.toHaveBeenCalled();
  });

  it("should return all tags", async () => {
    (TagService.getTags as any).mockResolvedValue({
      data: [
        { id: "1", tag: "Drama" },
        { id: "2", tag: "Books" },
      ],
      status: 200,
    });

    const ctx = makeCtx();

    await TagController.getTags(ctx as any);

    expect(TagService.getTags).toHaveBeenCalled();
    expect(ctx.json).toHaveBeenCalledWith(
      [
        { id: "1", tag: "Drama" },
        { id: "2", tag: "Books" },
      ],
      200
    );
  });

  it("should return tag by ID", async () => {
    (TagService.getTagById as any).mockResolvedValue({
      data: { id: "1", tag: "Drama" },
      status: 200,
    });

    const ctx = makeCtx({ params: { id: "1" } });

    await TagController.getTagById(ctx as any);

    expect(TagService.getTagById).toHaveBeenCalledWith("1");
    expect(ctx.json).toHaveBeenCalledWith({ tag: { id: "1", tag: "Drama" } }, 200);
  });

  it("should return 404 if tag not found", async () => {
    (TagService.getTagById as any).mockResolvedValue({
      error: "Tag not found",
      status: 404,
    });

    const ctx = makeCtx({ params: { id: "missing" } });

    await TagController.getTagById(ctx as any);

    expect(ctx.json).toHaveBeenCalledWith({ error: "Tag not found" }, 404);
  });
});
