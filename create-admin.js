const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixAdmin() {
  const email = 'admin@iyosiola.com';
  const password = 'admin123';

  try {
    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { loginAttempts: true }
    });

    console.log('Existing user:', existingUser ? {
      email: existingUser.email,
      role: existingUser.role,
      emailVerified: existingUser.emailVerified,
      isActive: existingUser.isActive,
      hasPassword: !!existingUser.password
    } : 'NOT FOUND');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Hash generated');

    if (existingUser) {
      // Update password and ensure all fields are correct
      const updated = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          emailVerified: new Date(),
          isActive: true,
          role: 'ADMIN',
          name: 'Admin'
        },
      });
      console.log('User updated successfully');
      console.log('Email:', updated.email);
      console.log('Role:', updated.role);
      console.log('isActive:', updated.isActive);
      console.log('emailVerified:', updated.emailVerified);
    } else {
      // Create new user
      const created = await prisma.user.create({
        data: {
          email,
          name: 'Admin',
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: new Date(),
          isActive: true,
        },
      });
      console.log('User created successfully');
      console.log('Email:', created.email);
      console.log('Role:', created.role);
    }

    // Clear any login attempts
    await prisma.loginAttempt.deleteMany({
      where: { userId: email }
    });

    console.log('========================================');
    console.log('LOGIN CREDENTIALS');
    console.log('========================================');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('========================================');

    // Test password hash
    const testHash = await prisma.user.findUnique({ where: { email } });
    const isValid = await bcrypt.compare(password, testHash.password);
    console.log('Password hash valid:', isValid);

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdmin();
