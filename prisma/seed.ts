import { PrismaClient, VolumeType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Create Retailers
    const tesco = await prisma.retailer.create({
        data: {
            name: 'Tesco',
            website: 'https://www.tesco.com/',
            volumeType: VolumeType.LOW,
        },
    });

    const asda = await prisma.retailer.create({
        data: {
            name: 'ASDA',
            website: 'https://www.asda.com/',
            volumeType: VolumeType.LOW,
        },
    });

    const costco = await prisma.retailer.create({
        data: {
            name: 'Costco Wholesale',
            website: 'https://www.costco.co.uk/',
            volumeType: VolumeType.HIGH,
        },
    });

    const booker = await prisma.retailer.create({
        data: {
            name: 'Booker Wholesale',
            website: 'https://www.booker.co.uk/',
            volumeType: VolumeType.HIGH,
        },
    });
    console.log('Created retailers...');

    // Create Ingredients
    const plainFlour = await prisma.ingredient.create({
        data: {
            name: 'Plain Flour',
            foodGroup: 'Grain',
            caloriesPer100g: 364,
            isVegan: true,
            isVegetarian: true,
        },
    });

    const casterSugar = await prisma.ingredient.create({
        data: {
            name: 'Caster Sugar',
            foodGroup: 'Sugar',
            caloriesPer100g: 400,
            isVegan: true,
            isVegetarian: true,
        },
    });

    const freeRangeEggs = await prisma.ingredient.create({
        data: {
            name: 'Free Range Eggs (Medium)',
            foodGroup: 'Dairy & Eggs',
            caloriesPer100g: 155,
            isVegan: false,
            isVegetarian: true,
        },
    });

    const unsaltedButter = await prisma.ingredient.create({
        data: {
            name: 'Unsalted Butter',
            foodGroup: 'Dairy & Eggs',
            caloriesPer100g: 717,
            isVegan: false,
            isVegetarian: true,
        },
    });

    const veganBlock = await prisma.ingredient.create({
        data: {
            name: 'Vegan Block (Butter Alternative)',
            foodGroup: 'Fat & Oil',
            caloriesPer100g: 720,
            isVegan: true,
            isVegetarian: true,
        },
    });

    const darkChocolate = await prisma.ingredient.create({
        data: {
            name: 'Dark Chocolate (70%)',
            foodGroup: 'Confectionery',
            caloriesPer100g: 598,
            isVegan: true,
            isVegetarian: true,
        },
    });
    console.log('Created ingredients...');

    // Link Ingredients to Retailers via IngredientSource
    await prisma.ingredientSource.createMany({
        data: [
            // Plain Flour
            { retailerId: tesco.id, ingredientId: plainFlour.id, pricePerKg: 0.80, productUrl: '#' },
            { retailerId: asda.id, ingredientId: plainFlour.id, pricePerKg: 0.75, productUrl: '#' },
            { retailerId: costco.id, ingredientId: plainFlour.id, pricePerKg: 0.50, productUrl: '#' },
            { retailerId: booker.id, ingredientId: plainFlour.id, pricePerKg: 0.45, productUrl: '#' },
            // Caster Sugar
            { retailerId: tesco.id, ingredientId: casterSugar.id, pricePerKg: 1.50, productUrl: '#' },
            { retailerId: asda.id, ingredientId: casterSugar.id, pricePerKg: 1.45, productUrl: '#' },
            { retailerId: booker.id, ingredientId: casterSugar.id, pricePerKg: 1.10, productUrl: '#' },
            // Eggs
            { retailerId: tesco.id, ingredientId: freeRangeEggs.id, pricePerKg: 3.00, productUrl: '#' },
            { retailerId: asda.id, ingredientId: freeRangeEggs.id, pricePerKg: 2.90, productUrl: '#' },
            // Butter
            { retailerId: tesco.id, ingredientId: unsaltedButter.id, pricePerKg: 7.00, productUrl: '#' },
            { retailerId: asda.id, ingredientId: unsaltedButter.id, pricePerKg: 6.95, productUrl: '#' },
            { retailerId: costco.id, ingredientId: unsaltedButter.id, pricePerKg: 6.50, productUrl: '#' },
            // Vegan Block
            { retailerId: tesco.id, ingredientId: veganBlock.id, pricePerKg: 8.00, productUrl: '#' },
            { retailerId: asda.id, ingredientId: veganBlock.id, pricePerKg: 7.90, productUrl: '#' },
            // Dark Chocolate
            { retailerId: tesco.id, ingredientId: darkChocolate.id, pricePerKg: 10.00, productUrl: '#' },
            { retailerId: booker.id, ingredientId: darkChocolate.id, pricePerKg: 8.50, productUrl: '#' },
        ],
    });
    console.log('Linked ingredients to sources...');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
