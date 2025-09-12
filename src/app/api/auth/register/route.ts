import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(req: Request) {
    try {
        const { email, password, userType } = await req.json();

        // Input whitelisting and validation
        if (!email || !email.includes('@') || !password || password.trim().length < 8) {
            return NextResponse.json({ message: 'Invalid input. Password must be at least 8 characters.' }, { status: 400 });
        }
        if (userType !== 'INDIVIDUAL' && userType !== 'CATERER') {
            return NextResponse.json({ message: 'Invalid user type.' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
        }

        const hashedPassword = await hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                userType,
            },
        });

        return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
