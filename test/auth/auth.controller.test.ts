import { describe, it, vi, beforeEach, expect } from "vitest";
import { AuthController } from "../../src/features/auth/auth.controller.js";
import { AuthService } from "../../src/features/auth/auth.service.js";

// Mock context
const createMockContext = (body = {}) => {
  return {
    req: {
      json: vi.fn().mockResolvedValue(body),
      header: vi.fn(),
    },
    get: vi.fn(),
    set: vi.fn(),
    json: vi.fn(),
  };
};

describe("AuthController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("register success", async () => {
    const mockContext = createMockContext({
      username: "testuser",
      email: "test@test.com",
      password: "12345678", // >= 8 chars
      fullName: "Test User",
    });

    // Mock the service response
    (AuthService.register as any) = vi.fn().mockResolvedValue({
      data: { id: "1", username: "testuser", email: "test@test.com", fullName: "Test User" },
      status: 201,
    });

    await AuthController.register(mockContext as any);

    expect(mockContext.json).toHaveBeenCalledWith(
      {
        message: "User registered successfully",
        user: { id: "1", username: "testuser", email: "test@test.com", fullName: "Test User" },
      },
      201
    );
  });

  it("login success", async () => {
    const mockContext = createMockContext({
      usernameOrEmail: "test@test.com",
      password: "12345678", // valid
    });

    (AuthService.login as any) = vi.fn().mockResolvedValue({
      data: { id: "1", username: "testuser", email: "test@test.com", token: "token123" },
      status: 200,
    });

    await AuthController.login(mockContext as any);

    expect(mockContext.json).toHaveBeenCalledWith(
      {
        message: "Login successful",
        user: { id: "1", username: "testuser", email: "test@test.com", token: "token123" },
      },
      200
    );
  });
});
