import { Hono } from 'hono'
import { authMiddleware } from '../../shared/middleware/auth.js';
import { BookController } from './book.controller.js';

const books = new Hono();

books.post('/', authMiddleware, BookController.createBook);
books.get('/my', authMiddleware, BookController.getMyBooks);

books.get('/all', BookController.getAllBooks);
books.get('/:id', BookController.getBookById);

books.put('/:id', authMiddleware, BookController.updateBook);
books.delete('/:id', authMiddleware, BookController.deleteBook);

export default books;