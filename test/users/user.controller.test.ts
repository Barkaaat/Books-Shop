import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserController } from "../../src/features/users/user.controller.js";
import { UserService } from "../../src/features/users/user.service.js";

function makeCtx(
  { body = null, params = {}, user = { id: "user-1" } }: { body?: any | null; params?: Record<string, any>; user?: { id: string } } = {}
) {
  return {
    req: { json: async () => body, param: (k: string) => params[k] },
    get: (k: string) => (k === "user" ? user : undefined),
    json: vi.fn(),
  };
}

describe("UserController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update user profile", async () => {
    const body = { username: "john_updated", fullName: "John Updated" };
    const updateSpy = vi.spyOn(UserService, "updateUser").mockResolvedValue({
      id: "user-1",
      username: "john_updated",
      email: "john@example.com",
      fullName: "John Updated",
    });

    const ctx = makeCtx({ body });

    await UserController.updateUser(ctx as any);

    expect(updateSpy).toHaveBeenCalledWith("user-1", body);
    expect(ctx.json).toHaveBeenCalledWith(
      {
        message: "User updated",
        user: { id: "user-1", username: "john_updated", email: "john@example.com", fullName: "John Updated" },
      },
      200
    );
  });

  it("should return 404 if updating non-existent user", async () => {
    const body = { username: "validname" };
    const updateSpy = vi.spyOn(UserService, "updateUser").mockResolvedValue(null);

    const ctx = makeCtx({ body });

    await UserController.updateUser(ctx as any);

    expect(updateSpy).toHaveBeenCalledWith("user-1", body);
    expect(ctx.json).toHaveBeenCalledWith({ error: "User not found" }, 404);
  });
});
