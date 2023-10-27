import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


const isInitialized = (await prisma.loyaltyStoreOffer.count()) > 0;

if (!isInitialized) {
    console.log('going to initialize')

    await prisma.loyaltyStoreOffer.createMany({
        data: [...Array(16384).keys()].map(i => ({
            offerId: i,
            corporationId: i,
        }))
    })

    console.log('initialized successfully!')
}

console.log('going to run buggy query')

await prisma.loyaltyStoreOffer.findMany({
    select: {
        offerId: true,
        corporationId: true,
        requiredItems: {
            select: {
                typeId: true,
                corporationId: true,
            },
        },
    },
})
