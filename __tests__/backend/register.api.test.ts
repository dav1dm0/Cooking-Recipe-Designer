import { POST } from '@/src/app/api/auth/register/route';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

// Mock the Prisma client
jest.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));

// Mock bcrypt's hash function
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

describe('POST /api/auth/register', () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test Case: Normal (Successful Registration)
    test('should register a new user successfully', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        (hash as jest.Mock).mockResolvedValue('hashedpassword');
        (prisma.user.create as jest.Mock).mockResolvedValue({ id: '123', email: 'test@example.com' });

        const request = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123',
                userType: 'INDIVIDUAL',
            }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(201);
        expect(body.message).toBe('User created successfully');
    });

    // Test Case: Invalid (Short Password)
    test('should return 400 for a password shorter than 8 characters', async () => {
        const request = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: '123', userType: 'INDIVIDUAL' }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.message).toContain('Password must be at least 8 characters');
    });

    // Test Case: Invalid (Invalid Email)
    test('should return 400 for an invalid email format', async () => {
        const request = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email: 'invalid-email', password: 'password123', userType: 'INDIVIDUAL' }),
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
    });

    // Test Case: Null (Missing Email)
    test('should return 400 if email is missing', async () => {
        const request = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ password: 'password123', userType: 'INDIVIDUAL' }),
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
    });

    // Test Case: Erroneous (User Already Exists)
    test('should return 409 if the user already exists', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '123', email: 'exists@example.com' });

        const request = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email: 'exists@example.com', password: 'password123', userType: 'INDIVIDUAL' }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(409);
        expect(body.message).toBe('User with this email already exists.');
    });
});