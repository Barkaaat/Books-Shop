import type { Context } from 'hono'
import { UserService } from './user.service.js'
import { updateUserSchema } from './user.schema.js';

export const UserController = {
    getUser: async (c: Context) => {
        try {
            const id = c.get("user").id;

            const user = await UserService.getUserById(id);

            if (!user) {
                return c.json({ error: "User not found" }, 404);
            }

            return c.json({ user }, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Internal server error" }, 500);
        }
    },

    updateUser: async (c: Context) => {
        try {
            const body = await c.req.json();
            const id = c.get("user").id;

            const parsed = updateUserSchema.safeParse(body);
            if (!parsed.success) {
                return c.json({ error: parsed.error.issues }, 400);
            }

            const updatedUser = await UserService.updateUser(id, parsed.data);
            if (!updatedUser) {
                return c.json({ error: "User not found" }, 404);
            }

            return c.json({ message: "User updated", user: updatedUser }, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Internal server error" }, 500);
        }
    }
}