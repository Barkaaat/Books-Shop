import { db } from "../../config/db.js";
import { users } from "../../db/schema/users.js";
import { eq, or } from "drizzle-orm";

export const UserService = {
    getUserById: async (id: string) => {
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
    },

    updateUser: async (id: string, data: any) => {
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
    },


}