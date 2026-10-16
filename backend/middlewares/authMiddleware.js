import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Clerk } from '@clerk/clerk-sdk-node';
import { prisma } from '../lib/prisma.ts';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const clerk = process.env.CLERK_SECRET_KEY
    ? new Clerk({ secretKey: process.env.CLERK_SECRET_KEY })
    : null;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
}

const allowedRoles = new Set(['CUSTOMER', 'STAFF', 'ADMIN']);

const getClerkUser = async (token) => {
    if (!clerk) {
        return null;
    }

    const claims = await clerk.verifyToken(token);
    if (!claims.sub) {
        return null;
    }

    const clerkUser = await clerk.users.getUser(claims.sub);
    const email = clerkUser.emailAddresses.find(
        (address) => address.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress;

    if (!email) {
        throw new Error('Clerk user has no primary email address');
    }

    const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;
    const requestedRole = clerkUser.publicMetadata?.role;
    const role = allowedRoles.has(requestedRole) ? requestedRole : 'CUSTOMER';

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ clerkId: claims.sub }, { email: email.trim().toLowerCase() }],
        },
    });

    if (existingUser && !existingUser.isActive) {
        return null;
    }

    const user = existingUser
        ? await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                clerkId: claims.sub,
                email: email.trim().toLowerCase(),
                fullName: fullName || undefined,
                emailVerifiedAt: clerkUser.emailAddresses.find(
                    (address) => address.id === clerkUser.primaryEmailAddressId,
                )?.verification?.status === 'verified'
                    ? new Date()
                    : undefined,
                lastLogin: new Date(),
            },
        })
        : await prisma.user.create({
            data: {
                clerkId: claims.sub,
                email: email.trim().toLowerCase(),
                fullName,
                role,
                authProvider: 'CLERK',
                emailVerifiedAt: clerkUser.emailAddresses.find(
                    (address) => address.id === clerkUser.primaryEmailAddressId,
                )?.verification?.status === 'verified'
                    ? new Date()
                    : null,
                lastLogin: new Date(),
            },
        });

    return { id: user.id, email: user.email, role: user.role, isActive: user.isActive };
};

export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.slice('Bearer '.length).trim();

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        return next();
    } catch {
        try {
            req.user = await getClerkUser(token);
            if (!req.user) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
            if (!req.user.isActive) {
                return res.status(403).json({ error: 'User account is inactive' });
            }
            return next();
        } catch (error) {
            console.error('Authentication token verification error:', error);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    }
};

export const authorizeUser = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
};
