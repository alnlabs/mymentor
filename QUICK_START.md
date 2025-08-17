# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18+
- npm or yarn

## One-Command Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd interview-platform

# Run the automated setup
node scripts/setup.js
```

This will:

- ✅ Install all dependencies
- ✅ Set up the database (SQLite)
- ✅ Run migrations
- ✅ Seed with sample data
- ✅ Create test users

## Manual Setup (if needed)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp env.development .env

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Seed database
node scripts/seed.js

# 6. Start development server
npm run dev
```

## Test Accounts

After setup, you can sign in with:

| Role        | Email                               | Password        |
| ----------- | ----------------------------------- | --------------- |
| Super Admin | `superadmin@interview-platform.com` | `superadmin123` |
| Admin       | `admin@interview-platform.com`      | `admin123`      |
| User        | `john.doe@example.com`              | `password123`   |

## What's Included

### 📊 Sample Data

- **50+ Coding Problems** (Java, JavaScript, Python)
- **100+ MCQ Questions** (Basics, OOP, Advanced)
- **3 Interview Templates** (Frontend, Backend, Full Stack)
- **3 Sample Exams** (JavaScript, DSA, System Design)

### 👥 User Roles

- **Students**: Practice problems, take MCQs, track progress
- **Admins**: Manage content, users, analytics
- **Super Admins**: Full system control

### 🛠️ Features Ready

- ✅ User authentication
- ✅ Coding problem practice
- ✅ MCQ quizzes
- ✅ Progress tracking
- ✅ Admin panel
- ✅ Interview templates

## Next Steps

1. **Start Development**: `npm run dev`
2. **Access Admin Panel**: `/admin` (after login)
3. **Student Dashboard**: `/student` (after login)
4. **Add Content**: Use admin panel to upload more problems/MCQs

## Database

- **Development**: SQLite (`./prisma/dev.db`)
- **Production**: PostgreSQL (update `DATABASE_URL` in `.env`)

## Troubleshooting

### Database Issues

```bash
# Reset database
npx prisma migrate reset --force

# Re-seed data
node scripts/seed.js
```

### Port Issues

- Default port: `4700`
- Change in `package.json` scripts if needed

### Environment Issues

- Ensure `.env` file exists
- Check `DATABASE_URL` is set correctly

## Support

- 📖 Full documentation: `README.md`
- 🛠️ Admin guide: `ADMIN_GUIDE.md`
- 🐳 Docker setup: `DOCKER_SETUP.md`
