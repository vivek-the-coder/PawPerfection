import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Seeding Database ---');

    // Clear existing data to ensure prices are updated
    try {
        await prisma.payment.deleteMany();
        await prisma.training.deleteMany();
        console.log('Cleared existing data.');
    } catch (e) {
        console.log('Error clearing data, likely FK constraints or empty db:', e.message);
    }

    const trainingData = [
        {
            week: 1,
            title: "Puppy Basics & Socialization",
            task: [
                "Introduce to new sounds",
                "Basic crate training",
                "Potty training routine",
                "Socialize with other dogs"
            ],
            resources: [
                "https://example.com/puppy-guide",
                "https://example.com/crate-training-video"
            ],
            price: 2999.00
        },
        {
            week: 2,
            title: "Basic Commands Mastery",
            task: [
                "Sit command",
                "Stay command",
                "Come command",
                "Leash walking basics"
            ],
            resources: [
                "https://example.com/commands-101",
                "https://example.com/leash-tips"
            ],
            price: 3999.00
        },
        {
            week: 3,
            title: "Advanced Tricks & Agility",
            task: [
                "Roll over",
                "Play dead",
                "Jump through hoop",
                "Weave poles introduction"
            ],
            resources: [
                "https://example.com/tricks-advanced",
                "https://example.com/agility-starter"
            ],
            price: 4999.00
        }
    ];

    console.log('Creating training programs...');
    for (const program of trainingData) {
        const training = await prisma.training.create({
            data: program,
        });
        console.log(`Created program: ${training.title}`);
    }

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
