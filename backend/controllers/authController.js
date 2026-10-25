import { prisma } from '../lib/prisma.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRATION || '1h';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
}

const publicUserSelect = {
    id: true,
    email: true,
    emailVerifiedAt: true,
    fullName: true,
    phone: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    lastLogin: true,
    authProvider: true,
};

const generateToken = (user) => jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
);

export const registerUser = async (req, res) => {
    const {
        fullName,
        fname,
        lname,
        email,
        password,
        role,
        phone,
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const name = fullName || `${fname || ''} ${lname || ''}`.trim() || null;
    const allowedRoles = ['CUSTOMER', 'STAFF', 'ADMIN'];

    if (role && !allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid user role' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email: normalizedEmail,
                passwordHash,
                role: role || 'CUSTOMER',
                fullName: name,
                phone: phone || null,
                emailVerifiedAt: new Date(),
            },
            select: publicUserSelect,
        });

        return res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.error('Register user error:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'A user with that email already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });

        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: 'User account is inactive' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
            select: publicUserSelect,
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: updatedUser,
            token: generateToken(updatedUser),
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const logoutUser = async (req, res) => res.status(200).json({
    success: true,
    message: 'Logged out successfully',
});

export const getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: publicUserSelect,
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Get user profile error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUserProfile = async (req, res) => {
    const { fullName, phone } = req.body;
    const data = {};

    if (fullName !== undefined) data.fullName = fullName;
    if (phone !== undefined) data.phone = phone;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'At least one profile field is required' });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data,
            select: publicUserSelect,
        });

        return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Update user profile error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUserPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({
            error: 'Current password and a new password of at least 8 characters are required',
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user || user.authProvider !== 'EMAIL' || !user.passwordHash) {
            return res.status(400).json({ error: 'Password changes are only available for email accounts' });
        }

        if (!await bcrypt.compare(currentPassword, user.passwordHash)) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: await bcrypt.hash(newPassword, 10) },
            select: publicUserSelect,
        });

        return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUserAccount = async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.user.id } });
        return res.status(200).json({
            success: true,
            message: 'User account deleted successfully',
        });
    } catch (error) {
        console.error('Delete user account error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and new password are required' });
    }

    try {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        const result = await prisma.user.updateMany({
            where: { email: email.trim().toLowerCase() },
            data: { passwordHash },
        });

        if (result.count === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

