import { PrismaClient, VolumeType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Create Retailers
    const tesco = await prisma.retailer.upsert({
        where: { name: 'Tesco' },
        update: {},
        create: {
            name: 'Tesco',
            website: 'https://www.tesco.com/',
            volumeType: VolumeType.LOW,
        },
    });

    const asda = await prisma.retailer.upsert({
        where: { name: 'ASDA' },
        update: {},
        create: {
            name: 'ASDA',
            website: 'https://www.asda.com/',
            volumeType: VolumeType.LOW,
        },
    });

    const costco = await prisma.retailer.upsert({
        where: { name: 'Costco Wholesale' },
        update: {},
        create: {
            name: 'Costco Wholesale',
            website: 'https://www.costco.co.uk/',
            volumeType: VolumeType.HIGH,
        },
    });

    const booker = await prisma.retailer.upsert({
        where: { name: 'Booker Wholesale' },
        update: {},
        create: {
            name: 'Booker Wholesale',
            website: 'https://www.booker.co.uk/',
            volumeType: VolumeType.HIGH,
        },
    });
    console.log('Retailers seeded...');

    // Create or update Ingredients
    const plainFlour = await prisma.ingredient.upsert({
        where: { name: 'Plain Flour' },
        update: {},
        create: {
            name: 'Plain Flour',
            foodGroup: 'Grain',
            caloriesPer100g: 364,
            isVegan: true,
            isVegetarian: true,
        },
    });

    const casterSugar = await prisma.ingredient.upsert({
        where: { name: 'Caster Sugar' },
        update: {},
        create: {
            name: 'Caster Sugar',
            foodGroup: 'Sugar',
            caloriesPer100g: 400,
            isVegan: true,
            isVegetarian: true,
        },
    });

    const freeRangeEggs = await prisma.ingredient.upsert({
        where: { name: 'Free Range Eggs (Medium)' },
        update: {},
        create: {
            name: 'Free Range Eggs (Medium)',
            foodGroup: 'Dairy & Eggs',
            caloriesPer100g: 155,
            isVegan: false,
            isVegetarian: true,
        },
    });

    const unsaltedButter = await prisma.ingredient.upsert({
        where: { name: 'Unsalted Butter' },
        update: {},
        create: {
            name: 'Unsalted Butter',
            foodGroup: 'Dairy & Eggs',
            caloriesPer100g: 717,
            isVegan: false,
            isVegetarian: true,
        },
    });

    const veganBlock = await prisma.ingredient.upsert({
        where: { name: 'Vegan Block (Butter Alternative)' },
        update: {},
        create: {
            name: 'Vegan Block (Butter Alternative)',
            foodGroup: 'Fat & Oil',
            caloriesPer100g: 720,
            isVegan: true,
            isVegetarian: true,
        },
    });

    const darkChocolate = await prisma.ingredient.upsert({
        where: { name: 'Dark Chocolate (70%)' },
        update: {},
        create: {
            name: 'Dark Chocolate (70%)',
            foodGroup: 'Confectionery',
            caloriesPer100g: 598,
            isVegan: true,
            isVegetarian: true,
        },
    });
    console.log('Ingredients seeded...');
    // Link Ingredients to Retailers via IngredientSource
    const ingredientSources = [
        { retailerId: tesco.id, ingredientId: plainFlour.id, pricePerKg: 0.80, productUrl: '#' },
        { retailerId: asda.id, ingredientId: plainFlour.id, pricePerKg: 0.75, productUrl: '#' },
        { retailerId: costco.id, ingredientId: plainFlour.id, pricePerKg: 0.50, productUrl: '#' },
        { retailerId: booker.id, ingredientId: plainFlour.id, pricePerKg: 0.45, productUrl: '#' },
        { retailerId: tesco.id, ingredientId: casterSugar.id, pricePerKg: 1.50, productUrl: '#' },
        { retailerId: asda.id, ingredientId: casterSugar.id, pricePerKg: 1.45, productUrl: '#' },
        { retailerId: booker.id, ingredientId: casterSugar.id, pricePerKg: 1.10, productUrl: '#' },
        { retailerId: tesco.id, ingredientId: freeRangeEggs.id, pricePerKg: 3.00, productUrl: '#' },
        { retailerId: asda.id, ingredientId: freeRangeEggs.id, pricePerKg: 2.90, productUrl: '#' },
        { retailerId: tesco.id, ingredientId: unsaltedButter.id, pricePerKg: 7.00, productUrl: '#' },
        { retailerId: asda.id, ingredientId: unsaltedButter.id, pricePerKg: 6.95, productUrl: '#' },
        { retailerId: costco.id, ingredientId: unsaltedButter.id, pricePerKg: 6.50, productUrl: '#' },
        { retailerId: tesco.id, ingredientId: veganBlock.id, pricePerKg: 8.00, productUrl: '#' },
        { retailerId: asda.id, ingredientId: veganBlock.id, pricePerKg: 7.90, productUrl: '#' },
        { retailerId: tesco.id, ingredientId: darkChocolate.id, pricePerKg: 10.00, productUrl: '#' },
        { retailerId: booker.id, ingredientId: darkChocolate.id, pricePerKg: 8.50, productUrl: '#' },
    ];

    for (const source of ingredientSources) {
        await prisma.ingredientSource.upsert({
            where: {
                ingredientId_retailerId: {
                    ingredientId: source.ingredientId,
                    retailerId: source.retailerId,
                }
            },
            update: {
                pricePerKg: source.pricePerKg // Update price in case it changes
            },
            create: source
        });
    }
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
