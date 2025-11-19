import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware } from '../../src/shared/middleware/auth.js';
import { verifyToken } from '../../src/shared/utils/jwt.js';
import { redis } from '../../src/config/redis.js';

vi.mock('../../src/shared/utils/jwt.js', () => ({ verifyToken: vi.fn() }));
vi.mock('../../src/config/redis.js', () => ({
  redis: { get: vi.fn(), setEx: vi.fn(), del: vi.fn() }
}));

describe('AuthMiddleware', () => {
  let next: any;
  beforeEach(() => {
    vi.clearAllMocks();
    next = vi.fn();
  });

  it('calls next if token is valid', async () => {
    const ctx: any = {
      req: { header: (name: string) => 'Bearer token-user1' },
      json: vi.fn(),
      set: vi.fn(),
    };
    (verifyToken as any).mockResolvedValue({ id: 'user1' });
    (redis.get as any).mockResolvedValue('token-user1');

    await authMiddleware(ctx, next);

    expect(ctx.set).toHaveBeenCalledWith('user', { id: 'user1' });
    expect(next).toHaveBeenCalled();
  });

  it('returns 401 if token is missing', async () => {
    const ctx: any = {
      req: { header: () => null },
      json: vi.fn(),
    };

    await authMiddleware(ctx, next);
    expect(ctx.json).toHaveBeenCalledWith({ error: "No token provided" }, 401);
  });

  it('returns 401 if token is invalid', async () => {
    const ctx: any = {
      req: { header: () => 'Bearer badtoken' },
      json: vi.fn(),
    };
    (verifyToken as any).mockRejectedValue(new Error('invalid token'));

    await authMiddleware(ctx, next);
    expect(ctx.json).toHaveBeenCalledWith({ error: "Invalid token" }, 401);
  });
});
