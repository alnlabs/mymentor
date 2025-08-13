#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up PostgreSQL database...');

async function setupPostgreSQL() {
  try {
    // Step 1: Check if Docker is running
    console.log('🐳 Checking Docker status...');
    try {
      execSync('docker --version', { stdio: 'pipe' });
    } catch (error) {
      console.error('❌ Docker is not running. Please start Docker Desktop first.');
      process.exit(1);
    }

    // Step 2: Start PostgreSQL container
    console.log('📦 Starting PostgreSQL container...');
    try {
      execSync('./scripts/docker-dev.sh start', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to start PostgreSQL container:', error.message);
      process.exit(1);
    }

    // Step 3: Wait for PostgreSQL to be ready
    console.log('⏳ Waiting for PostgreSQL to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 4: Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to generate Prisma client:', error.message);
      process.exit(1);
    }

    // Step 5: Run migrations
    console.log('🗄️  Running database migrations...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to run migrations:', error.message);
      process.exit(1);
    }

    // Step 6: Check if SQLite database exists and migrate data
    const sqlitePath = path.join(__dirname, '../prisma/dev.db');
    if (fs.existsSync(sqlitePath)) {
      console.log('🔄 Migrating data from SQLite to PostgreSQL...');
      try {
        execSync('npm run db:migrate:to-postgres', { stdio: 'inherit' });
      } catch (error) {
        console.error('❌ Failed to migrate data:', error.message);
        console.log('⚠️  Continuing without data migration...');
      }
    } else {
      console.log('📝 No existing SQLite database found. Seeding fresh data...');
    }

    // Step 7: Seed the database
    console.log('🌱 Seeding database...');
    try {
      execSync('npm run db:seed', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to seed database:', error.message);
      process.exit(1);
    }

    console.log('✅ PostgreSQL setup completed successfully!');
    console.log('');
    console.log('📊 Database Information:');
    console.log('  - Host: localhost');
    console.log('  - Port: 5432');
    console.log('  - Database: interview_platform_dev');
    console.log('  - Username: postgres');
    console.log('  - Password: dev_password_123');
    console.log('');
    console.log('🔗 Connection URL:');
    console.log('  postgresql://postgres:dev_password_123@localhost:5432/interview_platform_dev');
    console.log('');
    console.log('🌐 Access Points:');
    console.log('  - pgAdmin: http://localhost:8080 (admin@interview-platform.com / admin123)');
    console.log('  - Application: http://localhost:4700');
    console.log('');
    console.log('👑 Default Users:');
    console.log('  - Super Admin: superadmin@interview-platform.com / superadmin123');
    console.log('  - Admin: admin@interview-platform.com / admin123');
    console.log('  - User: john.doe@example.com / password123');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupPostgreSQL();
