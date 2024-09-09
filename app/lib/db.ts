import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Connect to PostgreSQL via Prisma.
 * Prisma automatically manages connection pooling and database connections.
 */
export async function connectToDB() {
  try {
    await prisma.$connect();  // Explicitly connect to the database if needed
    console.log('Connected to PostgreSQL via Prisma');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL via Prisma:', error);
    throw error;
  }
}

/**
 * Close the Prisma connection gracefully.
 * Typically handled automatically but can be useful for testing or cleanup.
 */
export async function closeConnection() {
  try {
    await prisma.$disconnect();  // Explicitly close the database connection
    console.log('Prisma connection closed');
  } catch (error) {
    console.error('Failed to close Prisma connection:', error);
  }
}

// Export Prisma client for use in the app
export { prisma as db };
