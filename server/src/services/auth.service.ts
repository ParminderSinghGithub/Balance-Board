import { query } from '../db_conn/db';
import bcrypt from 'bcryptjs';

export const createUser = async (email: string, password: string, name?: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, hashedPassword, name || null]
    );
    return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

export const findUserById = async (id: string) => {
    const result = await query('SELECT id, email, name FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

export const deleteUser = async (id: string) => {
    // Delete user - cascade will automatically delete all related transactions
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};

export const createPasswordResetOTP = async (userId: number, otp: string) => {
    // Delete any existing OTPs for this user
    await query('DELETE FROM password_resets WHERE user_id = $1', [userId]);
    
    // Create new OTP with 10-minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const result = await query(
        'INSERT INTO password_resets (user_id, otp, expires_at) VALUES ($1, $2, $3) RETURNING id',
        [userId, otp, expiresAt]
    );
    return result.rows[0];
};

export const verifyPasswordResetOTP = async (userId: number, otp: string): Promise<boolean> => {
    const result = await query(
        'SELECT * FROM password_resets WHERE user_id = $1 AND otp = $2 AND expires_at > NOW()',
        [userId, otp]
    );
    return result.rows.length > 0;
};

export const deletePasswordResetOTP = async (userId: number) => {
    await query('DELETE FROM password_resets WHERE user_id = $1', [userId]);
};

export const updatePassword = async (userId: number, hashedPassword: string) => {
    const result = await query(
        'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id',
        [hashedPassword, userId]
    );
    return result.rows[0];
};
