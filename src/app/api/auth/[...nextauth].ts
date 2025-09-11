import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prismaClient =
    globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;

export default NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error('No credentials provided');
                }
                const user = await prismaClient.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error('No user found with this email.');
                }

                const isValid = await compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error('Incorrect password.');
                }

                // Return user object without the password
                return { id: user.id, email: user.email, userType: user.userType };
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.userType = (user as any).userType;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).userType = token.userType;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});
