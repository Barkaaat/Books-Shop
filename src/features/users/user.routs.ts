import { Hono } from 'hono'
import { authMiddleware } from '../../shared/middleware/auth.js';
import { UserController } from './user.controller.js';

const users = new Hono();

users.get('/profile', authMiddleware, UserController.getUser);
users.put('/profile', authMiddleware, UserController.updateUser);

export default users;