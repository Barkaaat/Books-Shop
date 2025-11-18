import { Hono } from "hono";
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../shared/middleware/auth.js";

const auth = new Hono();

auth.post('/register', AuthController.register);
auth.post('/login', AuthController.login);
auth.post('/logout', authMiddleware, AuthController.logout);

auth.post('/forget-password', AuthController.forgetPassword);
auth.post('/reset-password', AuthController.resetPassword);
auth.put('/change-password', authMiddleware, AuthController.changePassword);

export default auth;