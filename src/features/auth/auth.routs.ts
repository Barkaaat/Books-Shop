import { Hono } from "hono";
import { AuthController } from "./auth.controller.js";

const authRoutes = new Hono();

authRoutes.post('/register', AuthController.register);

export default authRoutes;
