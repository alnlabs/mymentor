const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function setupSuperAdmin() {
  try {
    console.log("Setting up SuperAdmin user...");

    // Hash the default password
    const hashedPassword = await bcrypt.hash("MyMentor2024!", 12);

    // Check if SuperAdmin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: "superadmin" },
    });

    if (existingSuperAdmin) {
      console.log("SuperAdmin already exists, updating password...");

      // Update existing SuperAdmin with new password
      await prisma.user.update({
        where: { id: existingSuperAdmin.id },
        data: {
          password: hashedPassword,
          email: "admin@mymentor.com",
          name: "SuperAdmin",
          role: "superadmin",
          isActive: true,
        },
      });

      console.log("SuperAdmin password updated successfully!");
    } else {
      console.log("Creating new SuperAdmin user...");

      // Create new SuperAdmin user
      await prisma.user.create({
        data: {
          id: "superadmin-user",
          email: "admin@mymentor.com",
          name: "SuperAdmin",
          password: hashedPassword,
          role: "superadmin",
          isActive: true,
          provider: "local",
          emailVerified: true,
          profileCompleted: true,
          preferences: JSON.stringify({
            theme: "light",
            notifications: true,
            language: "en",
          }),
        },
      });

      console.log("SuperAdmin user created successfully!");
    }

    console.log("SuperAdmin setup completed!");
    console.log("Email: admin@mymentor.com");
    console.log("Password: MyMentor2024!");
  } catch (error) {
    console.error("Error setting up SuperAdmin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupSuperAdmin();
