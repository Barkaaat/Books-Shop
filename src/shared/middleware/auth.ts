import type { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt.js"
import { redis } from "../../config/redis.js";

export const authMiddleware = async (c: Context, next: Next) => {
    const authHeader = c.req.header("authorization");

    if (!authHeader) return c.json({ error: "No token provided" }, 401);

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded: any = await verifyToken(token);

        const stored = await redis.get(`auth:${decoded.id}`);

        if (!stored || stored !== token) {
        return c.json({ error: "Invalid or expired token" }, 401);
        }

        c.set("user", decoded);
        return next();
    } catch (err) {
        return c.json({ error: "Invalid token" }, 401);
    }
};
