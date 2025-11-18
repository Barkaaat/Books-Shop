import { registerSchema, loginSchema, changePasswordSchema } from "./auth.schema.js";
import { AuthService } from "./auth.service.js";
import type { Context } from "hono";

export class AuthController {
    static async register(c: Context) {
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
    }

    static async login(c: Context) {
        try {
            const body = await c.req.json();
            
            const parsed = loginSchema.safeParse(body);
            if (!parsed.success) {
                return c.json({ error: parsed.error.issues }, 400);
            }
            
            const { usernameOrEmail, password } = parsed.data;

            const result = await AuthService.login(usernameOrEmail, password);
            
            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json({ message: "Login successful", user: result.data }, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Internal server error" }, 500);
        }
    }

    static async logout(c: Context) {
        try {
            const user = c.get("user");

            const result = await AuthService.logout(user.id);

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json({ message: "Logged out successfully" }, 200);
        } catch (err) {
            console.error(err);
            return c.json({ error: "Internal server error" }, 500);
        }
    }

    static async forgetPassword(c: Context) {
        try {
            const { email } = await c.req.json();
            const result = await AuthService.forgetPassword(email);

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json({ message: "OTP = 123456 sent successfully, it will expired after 5 min" }, 200);
        } catch (err) {
            return c.json({ error: "Internal server error" }, 500);
        }
    }

    static async resetPassword(c: Context) {
        try {
            const { email, otp, newPassword } = await c.req.json();
            const result = await AuthService.resetPassword(email, otp, newPassword);

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json({ message: "Password reset successfully" }, 200);
        } catch (err) {
            return c.json({ error: "Internal server error" }, 500);
        }
    }

    static async changePassword(c: Context) {
        try {
            const user = c.get("user");
            const body = await c.req.json();

            const parsed = changePasswordSchema.safeParse(body);
            if (!parsed.success) {
                return c.json({ error: parsed.error.issues }, 400);
            }

            const { oldPassword, newPassword } = parsed.data;

            const result = await AuthService.changePassword(
                user.id,
                oldPassword,
                newPassword
            );

            if (result.error) {
                return c.json({ error: result.error }, result.status as any);
            }

            return c.json({ message: result.message }, 200);
        } catch (err) {
            return c.json({ error: "Internal server error" }, 500);
        }
    }
}