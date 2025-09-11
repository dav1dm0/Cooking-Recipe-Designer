import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const ingredients = await prisma.ingredient.findMany({
            include: {
                sources: {
                    include: {
                        retailer: true,
                    },
                },
            },
        });
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch ingredients' });
    }
}
