import { db } from "../../config/db.js";
import { redis } from "../../config/redis.js";
import { users } from "../../db/schema/users.js";
import { hashPassword, comparePassword } from "../../shared/utils/password.js";
import { createToken } from "../../shared/utils/jwt.js";
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

    login: async (usernameOrEmail: string, password: string) => {
        const found = await db
            .select()
            .from(users)
            .where(
            or(
                eq(users.email, usernameOrEmail),
                eq(users.username, usernameOrEmail)
            ));

        if (found.length === 0) {
            return { error: "Invalid username/email or password", status: 401 };
        }

        const user = found[0];

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return { error: "Invalid username/email or password", status: 401 };
        }

        const { password: _, ...safeUser } = user;
        const token = await createToken(user.id, user.username, user.email);

        await redis.setEx(`auth:${user.id}`, 2073600, token);

        return { data: { ...safeUser, token }, status: 200 };
    },

    logout: async (userId: string) => {
        const deleted = await redis.del(`auth:${userId}`);

        if (deleted === 0) {
            return { error: "User already logged out or session expired", status: 400 };
        }

        return { status: 200 };
    },

    forgetPassword: async (email: string) => {
        const found = await db.select().from(users).where(eq(users.email, email));
        if (found.length === 0) {
            return { error: "Email not found", status: 404 };
        }
        const OTP = "123456";
        await redis.setEx(`otp:${email}`, 300, OTP);

        return { status: 200 };
    },

    resetPassword: async (email: string, otp: string, newPassword: string) => {
        const storedOtp = await redis.get(`otp:${email}`);

        if (!storedOtp) {
            return { error: "OTP expired or not found", status: 400 };
        }

        if (storedOtp !== otp) {
            return { error: "Invalid OTP", status: 401 };
        }
        const hashed = await hashPassword(newPassword);

        await db.update(users)
            .set({ password: hashed })
            .where(eq(users.email, email));

        await redis.del(`otp:${email}`);

        return { status: 200 };
    },
};
