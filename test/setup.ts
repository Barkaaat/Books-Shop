import { vi } from 'vitest';

// Mock DB
export const db = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
};

// Mock Redis
export const redis = {
  get: vi.fn(),
  setEx: vi.fn(),
  del: vi.fn(),
};

// Mock password utils
export const hashPassword = vi.fn((p: string) => Promise.resolve(`hashed-${p}`));
export const comparePassword = vi.fn((p: string, h: string) => Promise.resolve(h === `hashed-${p}`));

// Mock JWT utils
export const createToken = vi.fn((id: string) => Promise.resolve(`token-${id}`));
export const verifyToken = vi.fn(() => Promise.resolve({ id: 'user1', username: 'test', email: 'test@example.com' }));
