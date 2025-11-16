import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js'

const SECRET_KEY = env.JWT_SECRET || 'your-secret-key';

export const createToken = (id: string, username: string, email: string) => {
    return jwt.sign(
        { id, username, email },
        SECRET_KEY,
        { expiresIn: "7d" }
    );
};

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        return null;
    }
};