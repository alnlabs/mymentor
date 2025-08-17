#!/bin/bash

# MyMentor Environment Switcher
# Usage: ./switch-env.sh [dev|test|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  MyMentor Environment Switcher${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [dev|test|prod]"
    echo ""
    echo "Options:"
    echo "  dev   - Switch to development environment"
    echo "  test  - Switch to test environment"
    echo "  prod  - Switch to production environment"
    echo ""
    echo "Examples:"
    echo "  $0 dev   # Switch to development"
    echo "  $0 test  # Switch to test"
    echo "  $0 prod  # Switch to production"
    echo ""
    echo "Current environment: $(get_current_env)"
}

# Function to get current environment
get_current_env() {
    if [ ! -f ".env" ]; then
        echo "none"
        return
    fi

    # Check which env file matches the current .env
    if cmp -s .env env.development; then
        echo "development"
    elif cmp -s .env env.test; then
        echo "test"
    elif cmp -s .env env.production; then
        echo "production"
    else
        echo "custom"
    fi
}

# Function to backup current .env
backup_env() {
    if [ -f ".env" ]; then
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        print_status "Current .env backed up"
    fi
}

# Function to switch to development environment
switch_to_dev() {
    print_status "Switching to development environment..."

    if [ ! -f "env.development" ]; then
        print_error "env.development file not found!"
        exit 1
    fi

    backup_env
    cp env.development .env
    print_status "Switched to development environment"
    print_status "Database: SQLite (dev.db)"
    print_status "Port: 4700"
}

# Function to switch to test environment
switch_to_test() {
    print_status "Switching to test environment..."

    if [ ! -f "env.test" ]; then
        print_error "env.test file not found!"
        exit 1
    fi

    backup_env
    cp env.test .env
    print_status "Switched to test environment"
    print_status "Database: PostgreSQL (port 5433)"
    print_status "Redis: Port 6380"
    print_status "pgAdmin: Port 8081"
    print_warning "Make sure Docker containers are running: npm run docker:test:start"
}

# Function to switch to production environment
switch_to_prod() {
    print_status "Switching to production environment..."

    if [ ! -f "env.production" ]; then
        print_error "env.production file not found!"
        exit 1
    fi

    backup_env
    cp env.production .env
    print_status "Switched to production environment"
    print_warning "Production environment configured"
    print_warning "Make sure to update production-specific values!"
}

# Function to show environment info
show_env_info() {
    local env=$1
    echo ""
    echo -e "${BLUE}Environment Information:${NC}"

    case $env in
        "dev"|"development")
            echo "  Database: SQLite (dev.db)"
            echo "  Port: 4700"
            echo "  Features: Development mode, hot reload"
            ;;
        "test")
            echo "  Database: PostgreSQL (port 5433)"
            echo "  Redis: Port 6380"
            echo "  pgAdmin: Port 8081"
            echo "  Features: Test data, isolated environment"
            ;;
        "prod"|"production")
            echo "  Database: PostgreSQL (production)"
            echo "  Features: Production optimized, monitoring"
            ;;
    esac
}

# Function to run post-switch actions
run_post_switch_actions() {
    local env=$1

    case $env in
        "test")
            print_status "Running post-switch actions for test environment..."

            # Check if Docker containers are running
            if ! docker ps | grep -q "interview-platform-postgres"; then
                print_warning "PostgreSQL container not running. Starting test environment..."
                npm run docker:test:start
                sleep 5
            fi

            # Generate Prisma client
            print_status "Generating Prisma client..."
            npm run db:generate

            # Run migrations
            print_status "Running database migrations..."
            npm run db:migrate

            print_status "Test environment ready!"
            print_status "To seed the database, run: npm run db:seed:test"
            ;;
        "dev"|"development")
            print_status "Running post-switch actions for development environment..."

            # Generate Prisma client
            print_status "Generating Prisma client..."
            npm run db:generate

            # Run migrations
            print_status "Running database migrations..."
            npm run db:migrate

            print_status "Development environment ready!"
            print_status "To seed the database, run: npm run db:seed"
            ;;
        "prod"|"production")
            print_status "Production environment configured"
            print_warning "Please review and update production-specific values in .env"
            ;;
    esac
}

# Main script logic
main() {
    print_header

    # Check if no arguments provided
    if [ $# -eq 0 ]; then
        print_status "Current environment: $(get_current_env)"
        echo ""
        show_usage
        exit 0
    fi

    local target_env=$1

    # Show current environment
    local current_env=$(get_current_env)
    if [ "$current_env" != "none" ]; then
        print_status "Current environment: $current_env"
    fi

    # Switch based on argument
    case $target_env in
        "dev"|"development")
            switch_to_dev
            show_env_info "dev"
            run_post_switch_actions "dev"
            ;;
        "test")
            switch_to_test
            show_env_info "test"
            run_post_switch_actions "test"
            ;;
        "prod"|"production")
            switch_to_prod
            show_env_info "prod"
            run_post_switch_actions "prod"
            ;;
        "current"|"status")
            print_status "Current environment: $(get_current_env)"
            if [ -f ".env" ]; then
                echo ""
                echo "Environment variables:"
                grep -E "^(NODE_ENV|DATABASE_URL|PORT)=" .env | head -5
            fi
            ;;
        "backup")
            backup_env
            print_status "Environment backed up"
            ;;
        "restore")
            if [ -f ".env.backup" ]; then
                cp .env.backup .env
                print_status "Environment restored from backup"
            else
                print_error "No backup file found!"
                exit 1
            fi
            ;;
        *)
            print_error "Invalid environment: $target_env"
            echo ""
            show_usage
            exit 1
            ;;
    esac

    echo ""
    print_status "Environment switch completed successfully!"
    print_status "You can now run: npm run dev"
}

# Run main function with all arguments
main "$@"
