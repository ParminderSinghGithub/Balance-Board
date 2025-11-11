import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import * as authService from '../services/auth.service';
import * as emailService from '../services/email.service';

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1).optional(),
});

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = userSchema.parse(req.body);

        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const user = await authService.createUser(email, password, name);
        
        // Send welcome email (don't await - send asynchronously)
        emailService.sendWelcomeEmail(email, name).catch(err => {
            console.error('Failed to send welcome email:', err);
        });
        
        return res.status(201).json({ message: 'User created successfully!', user });

    } catch (error) {
        next(error);
        return;
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = userSchema.parse(req.body);

        const user = await authService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isEqual = await bcrypt.compare(password, user.password_hash);
        if (!isEqual) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not set in environment variables.');
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            secret,
            { expiresIn: '7d' }
        );

        return res.status(200).json({ token, userId: user.id });
        
    } catch (error) {
        next(error);
        return;
    }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }

        const user = await authService.findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({ 
            id: user.id, 
            email: user.email, 
            name: user.name 
        });

    } catch (error) {
        next(error);
        return;
    }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }

        // Get user details before deletion
        const user = await authService.findUserById(userId);
        
        // Delete the user account
        await authService.deleteUser(userId);
        
        // Send account deletion confirmation email (async, non-blocking)
        if (user?.email) {
            emailService.sendAccountDeletionEmail(user.email, user.name).catch(err => {
                console.error('Failed to send account deletion email:', err);
            });
        }
        
        return res.status(200).json({ message: 'Account deleted successfully.' });

    } catch (error) {
        next(error);
        return;
    }
};

// Request Password Reset (Send OTP)
export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = z.object({ email: z.string().email() }).parse(req.body);

        const user = await authService.findUserByEmail(email);
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.status(200).json({ message: 'If the email exists, an OTP has been sent.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in database with 10-minute expiry
        await authService.createPasswordResetOTP(user.id, otp);
        
        // Send OTP email
        await emailService.sendPasswordResetOTP(email, otp);
        
        return res.status(200).json({ message: 'OTP sent to your email.' });

    } catch (error) {
        next(error);
        return;
    }
};

// Verify OTP and Reset Password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, newPassword } = z.object({
            email: z.string().email(),
            otp: z.string().length(6),
            newPassword: z.string().min(6),
        }).parse(req.body);

        const user = await authService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Verify OTP
        const isValidOTP = await authService.verifyPasswordResetOTP(user.id, otp);
        if (!isValidOTP) {
            return res.status(401).json({ message: 'Invalid or expired OTP.' });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await authService.updatePassword(user.id, hashedPassword);
        
        // Delete used OTP
        await authService.deletePasswordResetOTP(user.id);
        
        return res.status(200).json({ message: 'Password reset successful.' });

    } catch (error) {
        next(error);
        return;
    }
};
