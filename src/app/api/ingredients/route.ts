import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
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
        return NextResponse.json(ingredients);
    } catch (error) {
        console.error("Failed to fetch ingredients", error);
        return NextResponse.json({ message: 'Failed to fetch ingredients' }, { status: 500 });
    }
}
