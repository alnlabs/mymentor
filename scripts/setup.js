#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up MyMentor Interview Platform...\n");

// Check if .env exists, if not copy from development
if (!fs.existsSync(".env")) {
  console.log("📝 Creating .env file from development template...");
  execSync("cp env.development .env", { stdio: "inherit" });
  console.log("✅ .env file created\n");
}

// Install dependencies
console.log("📦 Installing dependencies...");
try {
  execSync("npm install", { stdio: "inherit" });
  console.log("✅ Dependencies installed\n");
} catch (error) {
  console.error("❌ Failed to install dependencies");
  process.exit(1);
}

// Generate Prisma client
console.log("🔧 Generating Prisma client...");
try {
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("✅ Prisma client generated\n");
} catch (error) {
  console.error("❌ Failed to generate Prisma client");
  process.exit(1);
}

// Run migrations
console.log("🗄️ Running database migrations...");
try {
  execSync("npx prisma migrate dev --name init", { stdio: "inherit" });
  console.log("✅ Database migrations completed\n");
} catch (error) {
  console.error("❌ Failed to run migrations");
  process.exit(1);
}

// Seed database
console.log("🌱 Seeding database with initial data...");
try {
  execSync("node scripts/seed.js", { stdio: "inherit" });
  console.log("✅ Database seeded successfully\n");
} catch (error) {
  console.error("❌ Failed to seed database");
  process.exit(1);
}

console.log("🎉 Setup completed successfully!");
console.log("\n📋 Next steps:");
console.log("1. Start the development server: npm run dev");
console.log("2. Open http://localhost:4700 in your browser");
console.log("3. Sign in with one of the test accounts:");
console.log(
  "   - Super Admin: superadmin@interview-platform.com / superadmin123"
);
console.log("   - Admin: admin@interview-platform.com / admin123");
console.log("   - User: john.doe@example.com / password123");
console.log("\n📚 For more information, check the README.md file");
