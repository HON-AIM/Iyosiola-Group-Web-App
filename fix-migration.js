const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: './.env' })

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$executeRaw`
      UPDATE "_prisma_migrations" 
      SET "finished_at" = NOW(), 
          "applied_steps_count" = 1, 
          "rolled_back_at" = NULL,
          "logs" = 'Marked as successful after db push'
      WHERE "migration_name" = '20240101000000_init'
    `
    console.log('Migration marked as successful')
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
