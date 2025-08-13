# 🗄️ Database Migration & Seeding Guide

This guide covers the complete setup of PostgreSQL database with migrations and seeding for the Interview Platform.

## 📋 Overview

The project has been migrated from SQLite to PostgreSQL with Docker containers, supporting multiple environments (development, test, production) with comprehensive seeding and migration scripts.

## 🚀 Quick Setup

### One-Command Setup
```bash
# Complete PostgreSQL setup (Docker + Migration + Seeding)
npm run db:setup:postgres
```

### Manual Setup
```bash
# 1. Start PostgreSQL container
./scripts/docker-dev.sh start

# 2. Generate Prisma client
npm run db:generate

# 3. Run migrations
npm run db:migrate

# 4. Seed database
npm run db:seed
```

## 📁 File Structure

```
├── prisma/
│   ├── schema.prisma              # Database schema (PostgreSQL)
│   └── migrations/                # Database migrations
├── scripts/
│   ├── seed.js                    # Database seeding script
│   ├── migrate-to-postgres.js     # SQLite to PostgreSQL migration
│   ├── setup-postgres.js          # Complete setup script
│   └── docker-dev.sh              # Docker environment management
├── docker-compose.yml             # Base Docker configuration
├── docker-compose.dev.yml         # Development overrides
├── docker-compose.test.yml        # Test overrides
├── docker-compose.prod.yml        # Production overrides
├── env.development                # Development environment variables
├── env.test                       # Test environment variables
└── env.production                 # Production environment variables
```

## 🔧 Available Scripts

### Database Management
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Reset database (WARNING: deletes all data)
npm run db:reset:dev
npm run db:reset:test
```

### Seeding
```bash
# Seed development database
npm run db:seed

# Seed test database
npm run db:seed:test

# Complete setup (generate + migrate + seed)
npm run db:setup:dev
npm run db:setup:test
```

### Migration
```bash
# Migrate from SQLite to PostgreSQL
npm run db:migrate:to-postgres

# Complete PostgreSQL setup
npm run db:setup:postgres
```

### Docker Management
```bash
# Development environment
npm run docker:dev:start
npm run docker:dev:stop
npm run docker:dev:restart
npm run docker:dev:status
npm run docker:dev:logs
npm run docker:dev:shell
npm run docker:dev:backup
npm run docker:dev:seed
npm run docker:dev:reset
npm run docker:dev:clean

# Test environment
npm run docker:test:start
npm run docker:test:stop
npm run docker:test:run
npm run docker:test:seed

# Production environment
npm run docker:prod:start
npm run docker:prod:stop
npm run docker:prod:monitoring
```

## 🌱 Seeding Data

### Default Users Created

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Super Admin | `superadmin@interview-platform.com` | `superadmin123` | Full system access |
| Admin | `admin@interview-platform.com` | `admin123` | Platform administration |
| Content Manager | `content@interview-platform.com` | `content123` | Content management |
| User | `john.doe@example.com` | `password123` | Regular user |
| User | `jane.smith@example.com` | `password123` | Regular user |
| User | `bob.wilson@example.com` | `password123` | Regular user |

### Sample Data Created

#### Interview Templates
- **Frontend Developer Interview** (60 min, Medium)
- **Backend Developer Interview** (90 min, Hard)
- **Full Stack Developer Interview** (120 min, Hard)

#### Coding Problems
- **Reverse String** (Easy) - String manipulation
- **Two Sum** (Medium) - Hash tables, arrays

#### MCQ Questions
- **Array Access Time Complexity** (Easy) - Data structures
- **JavaScript Frameworks** (Easy) - Web development
- **Database Indexes** (Medium) - Database optimization

#### Exams
- **JavaScript Fundamentals** (30 min, Easy) - 10 questions
- **Data Structures & Algorithms** (60 min, Medium) - 20 questions
- **System Design** (90 min, Hard) - 15 questions

## 🔄 Migration from SQLite

If you have an existing SQLite database, the migration process will:

1. **Backup SQLite database** to `prisma/dev.db.backup`
2. **Read all data** from SQLite tables
3. **Migrate data** to PostgreSQL with proper data types
4. **Preserve relationships** between tables
5. **Handle conflicts** using upsert operations

### Migration Process
```bash
# Automatic migration (part of setup)
npm run db:setup:postgres

# Manual migration
npm run db:migrate:to-postgres
```

### Migration Details
- **Users**: Migrated by email (unique constraint)
- **Problems**: Migrated by title (unique constraint)
- **MCQ Questions**: Migrated by question text (unique constraint)
- **Templates**: Migrated by name (unique constraint)
- **Exams**: Migrated by title (unique constraint)
- **Related Data**: Migrated with preserved relationships

## 🗄️ Database Schema

### Core Models
- **User**: Authentication, roles, profiles
- **Problem**: Coding problems with test cases
- **MCQQuestion**: Multiple choice questions
- **Submission**: User code submissions
- **UserProgress**: Learning progress tracking

### Interview System
- **InterviewTemplate**: Interview templates
- **MockInterview**: User interview sessions
- **InterviewQuestion**: Questions in templates
- **InterviewAnswer**: User answers
- **InterviewFeedback**: Interview feedback

### Exam System
- **Exam**: Exam definitions
- **ExamQuestion**: Questions in exams
- **ExamSession**: User exam sessions
- **ExamResult**: Exam results
- **ExamQuestionResult**: Individual question results

### Feedback System
- **Feedback**: User feedback and suggestions

## 🔒 Security Features

### Environment-Specific Security

| Feature | Development | Test | Production |
|---------|-------------|------|------------|
| Password Complexity | Low | Medium | High |
| Confirmation Required | No | Yes | Yes |
| Max Delete Count | 100 | 50 | 10 |
| Allow Reset | Yes | Yes | No |
| Allow Migrate | Yes | Yes | No |
| Require Backup | No | No | Yes |

### Database Access Control
- **Role-Based Access Control (RBAC)**
- **Environment-Based Restrictions**
- **Confirmation Tokens** for dangerous operations
- **Audit Logging**
- **Safe Database Wrappers**

## 🐳 Docker Environment

### Development
- **Database**: `interview_platform_dev`
- **Port**: `5432`
- **pgAdmin**: `http://localhost:8080`
- **Redis**: `localhost:6379`
- **MailHog**: `http://localhost:8025`

### Test
- **Database**: `interview_platform_test`
- **Port**: `5433`
- **pgAdmin**: `http://localhost:8081`
- **Redis**: `localhost:6380`

### Production
- **Database**: `interview_platform_prod`
- **Port**: `5432`
- **Monitoring**: Prometheus + Grafana

## 🔧 Environment Variables

### Required Variables
```bash
DATABASE_URL="postgresql://postgres:dev_password_123@localhost:5432/interview_platform_dev"
NODE_ENV=development
```

### Optional Variables
```bash
# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Database Access Control
DB_ACCESS_ENVIRONMENT=development
DB_ACCESS_REQUIRE_CONFIRMATION=false
DB_ACCESS_MAX_DELETE_COUNT=100
DB_ACCESS_ALLOW_RESET=true
DB_ACCESS_ALLOW_MIGRATE=true

# Logging
LOG_LEVEL=debug
ENABLE_DEBUG_LOGS=true
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check if PostgreSQL is running
./scripts/docker-dev.sh status

# Check logs
./scripts/docker-dev.sh logs postgres

# Restart container
./scripts/docker-dev.sh restart
```

#### 2. Migration Failed
```bash
# Reset migrations
rm -rf prisma/migrations
mkdir prisma/migrations

# Create new migration
DATABASE_URL="postgresql://postgres:dev_password_123@localhost:5432/interview_platform_dev" npx prisma migrate dev --name init
```

#### 3. Seeding Failed
```bash
# Check database connection
npm run db:studio

# Reset and reseed
npm run db:reset:dev
```

#### 4. Port Already in Use
```bash
# Check what's using the port
lsof -i :5432

# Kill the process
sudo kill -9 <PID>
```

### Reset Everything
```bash
# Nuclear option
./scripts/docker-dev.sh clean
./scripts/docker-dev.sh start
npm run db:setup:postgres
```

## 📊 Monitoring

### Development
- **pgAdmin**: Database management interface
- **MailHog**: Email testing interface
- **Docker logs**: Container monitoring

### Production
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Database backups**: Automated backups

## 🎯 Best Practices

1. **Always use the management scripts** for database operations
2. **Never commit sensitive data** - use environment files
3. **Regular backups** in production
4. **Test migrations** in development first
5. **Use different passwords** for each environment
6. **Monitor resource usage** in production
7. **Keep containers updated** regularly

## 📚 Additional Resources

- [Docker Setup Guide](./DOCKER_SETUP.md)
- [Database Access Control Guide](./DATABASE_ACCESS_CONTROL.md)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
