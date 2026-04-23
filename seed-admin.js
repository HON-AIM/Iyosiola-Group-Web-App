const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: './.env' })

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iyosiola.com' },
    update: {
      role: 'ADMIN',
      password: hashedPassword,
      emailVerified: new Date(),
    },
    create: {
      email: 'admin@iyosiola.com',
      name: 'Iyosiola Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  
  console.log('Admin account ready!')
  console.log('Email:', admin.email)
  console.log('Temp Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
