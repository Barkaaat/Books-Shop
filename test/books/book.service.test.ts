import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookService } from '../../src/features/books/book.service.js';
import { db } from '../../src/config/db.js';

vi.mock('../../src/config/db.js', () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('BookService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a book correctly', async () => {
    (db.insert as any).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 'book1', title: 'Book 1', authorId: 'author1', categoryId: 'cat1', price: '10' }]),
      }),
    });

    const result = await BookService.createBook({
      title: 'Book 1',
      price: 10,
      authorId: 'author1',
      categoryId: 'cat1',
      tags: [],
    });

    expect(result.data.id).toBe('book1');
  });

  it('gets book by ID', async () => {
    (db.select as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: 'book1', title: 'Book 1', authorId: 'author1', categoryId: 'cat1', price: '10' }]),
      }),
    });

    const result = await BookService.getBookById('book1');
    expect(result.data?.id).toBe('book1');
    expect(result.status).toBe(200);
  });

  it('throws error if book not found', async () => {
    (db.select as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    });

    const result = await BookService.getBookById('invalid');
    expect(result.error).toBe('Book not found');
    expect(result.status).toBe(404);
  });
});
