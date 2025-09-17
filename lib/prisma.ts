import { PrismaClient } from '@prisma/client';

// ensures a new client is created for each serverless function invocation
const prisma = new PrismaClient();

export { prisma };