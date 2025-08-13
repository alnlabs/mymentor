# 🐳 Docker Setup Guide

This project uses Docker containers to provide a clean, isolated development environment with PostgreSQL and Redis. The setup supports multiple environments: **development**, **test**, and **production**.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)
- At least 4GB of available RAM

## 🚀 Quick Start

### Development Environment

1. **Start the development environment:**

   ```bash
   ./scripts/docker-dev.sh start
   ```

2. **Check status:**

   ```bash
   ./scripts/docker-dev.sh status
   ```

3. **View logs:**

   ```bash
   ./scripts/docker-dev.sh logs
   ```

4. **Stop the environment:**
   ```bash
   ./scripts/docker-dev.sh stop
   ```

## 🏗️ Environment Configuration

### Development Environment

- **Database**: `interview_platform_dev`
- **Port**: `5432`
- **pgAdmin**: `http://localhost:8080`
- **Redis**: `localhost:6379`
- **MailHog**: `http://localhost:8025`

### Test Environment

- **Database**: `interview_platform_test`
- **Port**: `5433`
- **pgAdmin**: `http://localhost:8081`
- **Redis**: `localhost:6380`

### Production Environment

- **Database**: `interview_platform_prod`
- **Port**: `5432`
- **Monitoring**: Prometheus (`localhost:9090`) + Grafana (`localhost:3000`)

## 📁 File Structure

```
├── docker-compose.yml          # Base configuration
├── docker-compose.dev.yml      # Development overrides
├── docker-compose.test.yml     # Test overrides
├── docker-compose.prod.yml     # Production overrides
├── env.development             # Development environment variables
├── env.test                    # Test environment variables
├── env.production              # Production environment variables
├── scripts/
│   ├── docker-dev.sh           # Development environment management
│   ├── init-db.sql             # Database initialization
│   └── backup.sh               # Database backup script
└── backups/                    # Database backups (created automatically)
```

## 🔧 Manual Docker Commands

### Development

```bash
# Start with development overrides
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Stop
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
```

### Test

```bash
# Start with test overrides
docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d

# Run tests
docker-compose -f docker-compose.yml -f docker-compose.test.yml --profile test up test-runner

# Seed test database
docker-compose -f docker-compose.yml -f docker-compose.test.yml --profile seed up seed-test
```

### Production

```bash
# Start with production overrides
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Start with monitoring
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --profile monitoring up -d
```

## 🛠️ Development Scripts

### `./scripts/docker-dev.sh`

A comprehensive script for managing the development environment:

```bash
# Start development environment
./scripts/docker-dev.sh start

# Stop development environment
./scripts/docker-dev.sh stop

# Restart development environment
./scripts/docker-dev.sh restart

# Show status
./scripts/docker-dev.sh status

# View logs (all services)
./scripts/docker-dev.sh logs

# View logs (specific service)
./scripts/docker-dev.sh logs postgres

# Open PostgreSQL shell
./scripts/docker-dev.sh shell

# Create database backup
./scripts/docker-dev.sh backup

# Seed database
./scripts/docker-dev.sh seed

# Reset environment (WARNING: deletes all data)
./scripts/docker-dev.sh reset

# Clean up everything
./scripts/docker-dev.sh clean

# Show help
./scripts/docker-dev.sh help
```

## 🔗 Database Connections

### Development

```bash
# Connection string
postgresql://postgres:dev_password_123@localhost:5432/interview_platform_dev

# Using psql
psql -h localhost -p 5432 -U postgres -d interview_platform_dev
```

### Test

```bash
# Connection string
postgresql://postgres:test_password_123@localhost:5433/interview_platform_test

# Using psql
psql -h localhost -p 5433 -U postgres -d interview_platform_test
```

### Production

```bash
# Connection string
postgresql://postgres:prod_secure_password_very_long_123@localhost:5432/interview_platform_prod

# Using psql
psql -h localhost -p 5432 -U postgres -d interview_platform_prod
```

## 🗄️ Database Management

### pgAdmin Access

- **Development**: http://localhost:8080

  - Email: `admin@interview-platform.com`
  - Password: `admin123`

- **Test**: http://localhost:8081
  - Email: `admin@interview-platform.com`
  - Password: `admin123`

### Manual Database Operations

```bash
# Connect to PostgreSQL container
docker-compose exec postgres psql -U postgres -d interview_platform_dev

# Create backup
docker-compose run --rm backup

# Restore from backup
docker-compose exec -T postgres pg_restore -U postgres -d interview_platform_dev < backup_file.sql
```

## 🔒 Security Features

### Environment-Specific Security

| Feature               | Development | Test   | Production |
| --------------------- | ----------- | ------ | ---------- |
| Password Complexity   | Low         | Medium | High       |
| Confirmation Required | No          | Yes    | Yes        |
| Max Delete Count      | 100         | 50     | 10         |
| Allow Reset           | Yes         | Yes    | No         |
| Allow Migrate         | Yes         | Yes    | No         |
| Require Backup        | No          | No     | Yes        |

### Database Access Control

The setup includes a comprehensive database access control system:

- **Role-Based Access Control (RBAC)**
- **Environment-Based Restrictions**
- **Confirmation Tokens for Dangerous Operations**
- **Audit Logging**
- **Safe Database Wrappers**

## 📊 Monitoring (Production)

### Prometheus

- **URL**: http://localhost:9090
- **Purpose**: Metrics collection and alerting

### Grafana

- **URL**: http://localhost:3000
- **Username**: `admin`
- **Password**: `admin123`
- **Purpose**: Metrics visualization and dashboards

## 🧪 Testing

### Run Tests

```bash
# Start test environment
docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d

# Run tests
docker-compose -f docker-compose.yml -f docker-compose.test.yml --profile test up test-runner

# Seed test database
docker-compose -f docker-compose.yml -f docker-compose.test.yml --profile seed up seed-test
```

## 🔄 Migration from SQLite

To migrate your existing SQLite database to PostgreSQL:

1. **Export SQLite data:**

   ```bash
   # Create SQL dump from SQLite
   sqlite3 prisma/dev.db .dump > sqlite_export.sql
   ```

2. **Start PostgreSQL:**

   ```bash
   ./scripts/docker-dev.sh start
   ```

3. **Import to PostgreSQL:**

   ```bash
   # Convert and import (you may need to modify the SQL for PostgreSQL compatibility)
   psql -h localhost -p 5432 -U postgres -d interview_platform_dev < sqlite_export.sql
   ```

4. **Update your application:**
   ```bash
   # Update DATABASE_URL in your .env file
   DATABASE_URL=postgresql://postgres:dev_password_123@localhost:5432/interview_platform_dev
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   # Check what's using the port
   lsof -i :5432

   # Kill the process
   sudo kill -9 <PID>
   ```

2. **Permission denied:**

   ```bash
   # Make scripts executable
   chmod +x scripts/*.sh
   ```

3. **Database connection failed:**

   ```bash
   # Check if containers are running
   ./scripts/docker-dev.sh status

   # Check logs
   ./scripts/docker-dev.sh logs postgres
   ```

4. **Out of memory:**
   ```bash
   # Increase Docker memory limit in Docker Desktop settings
   # Recommended: 4GB minimum, 8GB preferred
   ```

### Reset Everything

```bash
# Nuclear option - removes everything
./scripts/docker-dev.sh clean
./scripts/docker-dev.sh start
```

## 📝 Environment Variables

### Development (`env.development`)

```bash
NODE_ENV=development
DATABASE_URL=postgresql://postgres:dev_password_123@localhost:5432/interview_platform_dev
REDIS_URL=redis://:dev_redis_123@localhost:6379
```

### Test (`env.test`)

```bash
NODE_ENV=test
DATABASE_URL=postgresql://postgres:test_password_123@localhost:5433/interview_platform_test
REDIS_URL=redis://:test_redis_123@localhost:6380
```

### Production (`env.production`)

```bash
NODE_ENV=production
DATABASE_URL=postgresql://postgres:prod_secure_password_very_long_123@localhost:5432/interview_platform_prod
REDIS_URL=redis://:prod_secure_redis_password_very_long_123@localhost:6379
```

## 🎯 Best Practices

1. **Always use the management scripts** for development
2. **Never commit sensitive data** - use environment files
3. **Regular backups** in production
4. **Monitor resource usage** in production
5. **Use different passwords** for each environment
6. **Keep containers updated** regularly

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [pgAdmin Docker Image](https://hub.docker.com/r/dpage/pgadmin4/)
