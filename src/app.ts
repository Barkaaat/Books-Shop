import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from './config/env.js';
import { ensureDatabaseExists } from './db/createDatabase.js';
import authRouter from './features/auth/auth.routs.js';
import userRouter from './features/users/user.routs.js'
import bookRouter from './features/books/book.routs.js'
import tagsRouter from './features/tags/tag.routs.js';

const app = new Hono();

app.route('/auth', authRouter);
app.route('/user', userRouter);
app.route('/book', bookRouter);
app.route('/tags', tagsRouter);

await ensureDatabaseExists();
serve({
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port}`);
});