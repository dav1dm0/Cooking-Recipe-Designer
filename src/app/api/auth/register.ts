import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password, userType } = req.body;

    // Input whitelisting and validation
    if (!email || !email.includes('@') || !password || password.trim().length < 8) {
        return res.status(400).json({ message: 'Invalid input. Password must be at least 8 characters.' });
    }
    if (userType !== 'INDIVIDUAL' && userType !== 'CATERER') {
        return res.status(400).json({ message: 'Invalid user type.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await hash(password, 12);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                userType,
            },
        });
        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}