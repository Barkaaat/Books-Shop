import { registerSchema } from "./auth.schema.js";
import { AuthService } from "./auth.service.js";
import type { Context } from "hono";

export const AuthController = {
    register: async (c: Context) => {
        try {
            const body = await c.req.json();

            const parsed = registerSchema.safeParse(body);
            if (!parsed.success) {
                return c.json({ error: parsed.error.issues }, 400);
            }

            const { username, email, password, fullName } = parsed.data;

            const result = await AuthService.register(username, email, password, fullName);

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }
            
            return c.json({ message: "User registered successfully", user: result.data }, 201);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Internal server error" }, 500);
        }
    },
};