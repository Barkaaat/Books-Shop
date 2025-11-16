import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from './config/env.js';
import { ensureDatabaseExists } from './db/createDatabase.js';
import authRouter from './features/auth/auth.routs.js';

const app = new Hono();

app.route('/auth', authRouter);

await ensureDatabaseExists();
serve({
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port}`);
});