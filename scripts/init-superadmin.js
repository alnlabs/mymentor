const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function initSuperAdmin() {
  try {
    console.log('🔐 Initializing SuperAdmin...');

    // Check if SuperAdmin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'superadmin' }
    });

    if (existingSuperAdmin) {
      console.log('✅ SuperAdmin already exists:', existingSuperAdmin.email);
      return;
    }

    // Create SuperAdmin with hashed password
    const hashedPassword = await bcrypt.hash('MyMentor2024!', 12);
    
    const superAdmin = await prisma.user.create({
      data: {
        email: 'superadmin',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'superadmin',
        provider: 'email',
        isActive: true,
      },
    });

    console.log('✅ SuperAdmin created successfully!');
    console.log('Username: superadmin');
    console.log('Password: MyMentor2024!');
    console.log('⚠️  Please change these credentials after first login!');

  } catch (error) {
    console.error('❌ Error creating SuperAdmin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initSuperAdmin();
