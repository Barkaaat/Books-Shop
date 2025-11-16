import { db } from "../../config/db.js";
import { users } from "../../db/schema/users.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { eq, or } from "drizzle-orm";

export const AuthService = {
  register: async (username: string, email: string, password: string, fullName: string) => {
    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)));

    if (existing.length > 0) {
      return { error: `${existing[0].email === email? 'Email':'Username'} already exists`, status: 409 };
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await db
      .insert(users)
      .values({ username, email, password: hashedPassword, fullName })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        fullName: users.fullName,
      });

    return { data: newUser[0], status: 201 };
  },
};
