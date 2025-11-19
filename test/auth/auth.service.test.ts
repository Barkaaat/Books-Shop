import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as passwordUtils from '../../src/shared/utils/password.js';

vi.mock('../../src/shared/utils/password.js', () => ({
  hashPassword: vi.fn((p) => Promise.resolve(`hashed-${p}`)),
  comparePassword: vi.fn((p, h) => Promise.resolve(h === `hashed-${p}`)),
}));

vi.mock('../src/config/db.js', () => ({
  db: { select: vi.fn(), insert: vi.fn(), update: vi.fn() }
}));

vi.mock('../src/config/redis.js', () => ({
  redis: { setEx: vi.fn(), del: vi.fn() }
}));

describe('AuthService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('hashes password correctly', async () => {
    const hash = await passwordUtils.hashPassword('mypassword');
    expect(hash).toBe('hashed-mypassword');
  });

  it('compares password correctly', async () => {
    const match = await passwordUtils.comparePassword('mypassword', 'hashed-mypassword');
    expect(match).toBe(true);
  });
});
