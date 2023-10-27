import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


const isInitialized = (await prisma.a.count()) > 0;

if (!isInitialized) {
    console.log('going to initialize')

    await prisma.a.createMany({
        data: [...Array(16384).keys()].map(i => ({
            key1: i,
            key2: i,
        }))
    })

    console.log('initialized successfully!')
}

console.log('going to run buggy query')

await prisma.a.findMany({
    select: {
        key1: true,
        key2: true,
        children: {
            select: {
                bKey: true,
            },
        },
    },
})
