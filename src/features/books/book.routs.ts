import { Hono } from 'hono'
import { authMiddleware } from '../../shared/middleware/auth.js';
import { BookController } from './book.controller.js';

const books = new Hono();

books.post('/', authMiddleware, BookController.createBook);
books.get('/my', authMiddleware, BookController.getMyBooks);
books.get('/all', BookController.getAllBooks);

export default books;