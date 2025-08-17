#!/bin/bash

# MyMentor Environment Setup Script
# Usage: ./setup-env.sh [dev|test|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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
    echo -e "${BLUE}  MyMentor Environment Setup${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [dev|test|prod] [options]"
    echo ""
    echo "Environments:"
    echo "  dev   - Development environment (SQLite)"
    echo "  test  - Test environment (PostgreSQL + Docker)"
    echo "  prod  - Production environment (PostgreSQL)"
    echo ""
    echo "Options:"
    echo "  --no-seed    - Skip database seeding"
    echo "  --no-docker  - Skip Docker container setup"
    echo "  --reset      - Reset database before setup"
    echo "  --clean      - Clean all containers and volumes"
    echo ""
    echo "Examples:"
    echo "  $0 test              # Setup test environment with seeding"
    echo "  $0 dev --no-seed     # Setup dev environment without seeding"
    echo "  $0 test --reset      # Reset and setup test environment"
    echo "  $0 prod --clean      # Clean and setup production environment"
}

# Function to check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi

    # Check if Docker is installed (for test/prod)
    if [[ "$1" == "test" || "$1" == "prod" ]]; then
        if ! command -v docker &> /dev/null; then
            print_error "Docker is not installed. Please install Docker first."
            exit 1
        fi

        if ! docker info &> /dev/null; then
            print_error "Docker is not running. Please start Docker first."
            exit 1
        fi
    fi

    print_status "Prerequisites check passed"
}

# Function to install dependencies
install_dependencies() {
    print_step "Installing dependencies..."

    if [ ! -d "node_modules" ]; then
        print_status "Installing npm packages..."
        npm install
    else
        print_status "Dependencies already installed"
    fi
}

# Function to setup development environment
setup_dev() {
    print_step "Setting up development environment..."

    # Copy development environment
    if [ -f "env.development" ]; then
        cp env.development .env
        print_status "Development environment configured"
    else
        print_error "env.development file not found!"
        exit 1
    fi

    # Generate Prisma client
    print_status "Generating Prisma client..."
    npm run db:generate

    # Run migrations
    print_status "Running database migrations..."
    npm run db:migrate

    # Seed database if requested
    if [[ "$2" != "--no-seed" ]]; then
        print_status "Seeding development database..."
        npm run db:seed
    fi

    print_status "Development environment setup complete!"
    print_status "Database: SQLite (dev.db)"
    print_status "Port: 4700"
}

# Function to setup test environment
setup_test() {
    print_step "Setting up test environment..."

    # Copy test environment
    if [ -f "env.test" ]; then
        cp env.test .env
        print_status "Test environment configured"
    else
        print_error "env.test file not found!"
        exit 1
    fi

    # Setup Docker containers
    if [[ "$2" != "--no-docker" ]]; then
        print_status "Setting up Docker containers..."

        # Stop existing containers if clean flag is set
        if [[ "$*" == *"--clean"* ]]; then
            print_status "Cleaning existing containers..."
            npm run docker:test:stop
            docker system prune -f
        fi

        # Start containers
        npm run docker:test:start

        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 15

        # Check if database is ready
        local max_attempts=30
        local attempt=1

        while [ $attempt -le $max_attempts ]; do
            if docker exec interview-platform-postgres pg_isready -U postgres -d interview_platform_test &> /dev/null; then
                print_status "Database is ready!"
                break
            fi

            print_status "Waiting for database... (attempt $attempt/$max_attempts)"
            sleep 2
            attempt=$((attempt + 1))
        done

        if [ $attempt -gt $max_attempts ]; then
            print_error "Database failed to start within expected time"
            exit 1
        fi
    fi

    # Generate Prisma client
    print_status "Generating Prisma client..."
    npm run db:generate

    # Reset database if requested
    if [[ "$*" == *"--reset"* ]]; then
        print_status "Resetting test database..."
        npm run db:reset:test
    else
        # Run migrations
        print_status "Running database migrations..."
        npm run db:migrate

        # Seed database if requested
        if [[ "$2" != "--no-seed" ]]; then
            print_status "Seeding test database..."
            npm run db:seed:test
        fi
    fi

    print_status "Test environment setup complete!"
    print_status "Database: PostgreSQL (port 5433)"
    print_status "Redis: Port 6380"
    print_status "pgAdmin: Port 8081"
}

# Function to setup production environment
setup_prod() {
    print_step "Setting up production environment..."

    # Copy production environment
    if [ -f "env.production" ]; then
        cp env.production .env
        print_status "Production environment configured"
    else
        print_error "env.production file not found!"
        exit 1
    fi

    # Setup Docker containers
    if [[ "$2" != "--no-docker" ]]; then
        print_status "Setting up production Docker containers..."

        # Stop existing containers if clean flag is set
        if [[ "$*" == *"--clean"* ]]; then
            print_status "Cleaning existing containers..."
            npm run docker:prod:stop
            docker system prune -f
        fi

        # Start containers
        npm run docker:prod:start

        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 20
    fi

    # Generate Prisma client
    print_status "Generating Prisma client..."
    npm run db:generate

    # Run migrations
    print_status "Running database migrations..."
    npm run db:migrate

    print_warning "Production environment setup complete!"
    print_warning "Please review and update production-specific values in .env"
    print_warning "Database seeding is disabled for production"
}

# Function to show next steps
show_next_steps() {
    local env=$1
    echo ""
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  Next Steps${NC}"
    echo -e "${PURPLE}================================${NC}"

    case $env in
        "dev")
            echo "1. Start the development server:"
            echo "   npm run dev"
            echo ""
            echo "2. Access the application:"
            echo "   http://localhost:4700"
            echo ""
            echo "3. Login as superadmin:"
            echo "   Email: superadmin@interview-platform.com"
            echo "   Password: superadmin123"
            ;;
        "test")
            echo "1. Start the development server:"
            echo "   npm run dev"
            echo ""
            echo "2. Access the application:"
            echo "   http://localhost:4700"
            echo ""
            echo "3. Access pgAdmin (database management):"
            echo "   http://localhost:8081"
            echo "   Email: admin@interview-platform.com"
            echo "   Password: admin123"
            echo ""
            echo "4. Login as superadmin:"
            echo "   Email: superadmin@interview-platform.com"
            echo "   Password: superadmin123"
            ;;
        "prod")
            echo "1. Review production configuration:"
            echo "   nano .env"
            echo ""
            echo "2. Build the application:"
            echo "   npm run build"
            echo ""
            echo "3. Start the production server:"
            echo "   npm run start"
            echo ""
            echo "4. Monitor the application:"
            echo "   Check Docker logs and monitoring"
            ;;
    esac
}

# Main script logic
main() {
    print_header

    # Check if no arguments provided
    if [ $# -eq 0 ]; then
        show_usage
        exit 0
    fi

    local target_env=$1
    local options="${@:2}"

    # Validate environment
    case $target_env in
        "dev"|"development")
            env_name="development"
            ;;
        "test")
            env_name="test"
            ;;
        "prod"|"production")
            env_name="production"
            ;;
        *)
            print_error "Invalid environment: $target_env"
            show_usage
            exit 1
            ;;
    esac

    print_status "Setting up $env_name environment..."

    # Check prerequisites
    check_prerequisites $env_name

    # Install dependencies
    install_dependencies

    # Setup environment
    case $env_name in
        "development")
            setup_dev $env_name $options
            ;;
        "test")
            setup_test $env_name $options
            ;;
        "production")
            setup_prod $env_name $options
            ;;
    esac

    # Show next steps
    show_next_steps $env_name

    echo ""
    print_status "Environment setup completed successfully!"
}

# Run main function with all arguments
main "$@"
