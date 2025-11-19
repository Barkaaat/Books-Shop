import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/db.js", () => {
  return {
    db: {
      select: vi.fn(),
      update: vi.fn(() => ({ set: vi.fn().mockReturnThis(), where: vi.fn().mockReturnThis(), returning: vi.fn().mockResolvedValue([]) })),
    },
  };
});

import { db } from "../../src/config/db.js";
import { UserService } from "../../src/features/users/user.service.js";

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user by ID", async () => {
    const selectBuilder = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([{ username: "john", email: "john@example.com", name: "John Doe" }]),
    };
    (db.select as any).mockImplementation(() => selectBuilder);

    const user = await UserService.getUserById("user-1");

    expect(user).toEqual({ username: "john", email: "john@example.com", name: "John Doe" });
    expect(db.select).toHaveBeenCalled();
    expect(selectBuilder.from).toHaveBeenCalled();
    expect(selectBuilder.where).toHaveBeenCalledWith(expect.anything());
  });

  it("should update user", async () => {
    const updateBuilder = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([
        { id: "user-1", username: "john_updated", email: "john@example.com", fullName: "John Updated" },
      ]),
    };
    (db.update as any).mockImplementation(() => updateBuilder);

    const updated = await UserService.updateUser("user-1", { username: "john_updated" });

    expect(updated).toEqual({ id: "user-1", username: "john_updated", email: "john@example.com", fullName: "John Updated" });
    expect(updateBuilder.set).toHaveBeenCalledWith({ username: "john_updated" });
    expect(updateBuilder.where).toHaveBeenCalledWith(expect.anything());
  });

  it("should return null if user not found during update", async () => {
    const updateBuilder = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
    };
    (db.update as any).mockImplementation(() => updateBuilder);

    const updated = await UserService.updateUser("nonexistent", { username: "test" });

    expect(updated).toBeNull();
  });
});
