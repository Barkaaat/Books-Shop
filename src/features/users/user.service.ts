import { db } from "../../config/db.js";
import { users } from "../../db/schema/users.js";
import { eq } from "drizzle-orm";

export class UserService {
    static async getUserById(id: string) {
        const user = await db
            .select({
                username: users.username,
                email: users.email,
                name: users.fullName,
                created_at: users.createdAt,
                updateddAt: users.updateddAt,
            })
            .from(users)
            .where(eq(users.id, id));

        console.log(user);
        return user[0];
    }

    static async updateUser(id: string, data: any) {
        const updated = await db
            .update(users)
            .set(data)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                username: users.username,
                email: users.email,
                fullName: users.fullName
            });

        if (!updated.length) return null;

        return updated[0];
    }
}