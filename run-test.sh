#!/bin/bash

# MyMentor Test Environment Runner
# Usage: ./run-test.sh [options]

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
    echo -e "${BLUE}  MyMentor Test Environment Runner${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --setup      - Setup environment before running"
    echo "  --reset      - Reset database before running"
    echo "  --no-seed    - Skip database seeding"
    echo "  --no-docker  - Skip Docker container setup"
    echo "  --clean      - Clean containers before setup"
    echo "  --port PORT  - Use custom port (default: 4700)"
    echo "  --help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run test environment"
    echo "  $0 --setup            # Setup and run"
    echo "  $0 --reset            # Reset database and run"
    echo "  $0 --clean            # Clean containers and run"
    echo "  $0 --port 3000        # Run on port 3000"
    echo "  $0 --setup --no-seed  # Setup without seeding"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi

    print_status "Prerequisites check passed"
}

# Function to check if environment is set up
check_environment() {
    if [ ! -f ".env" ]; then
        print_warning "No .env file found. Setting up test environment..."
        return 1
    fi

    # Check if it's a test environment
    if grep -q "NODE_ENV=test" .env 2>/dev/null || grep -q "interview_platform_test" .env 2>/dev/null; then
        print_status "Test environment detected"
        return 0
    else
        print_warning "Current environment doesn't appear to be test"
        return 1
    fi
}

# Function to setup test environment
setup_test_environment() {
    print_status "Setting up test environment..."

    # Copy test environment
    if [ -f "env.test" ]; then
        cp env.test .env
        print_status "Test environment configured"
    else
        print_error "env.test file not found!"
        exit 1
    fi

    # Setup Docker containers
    if [[ "$*" != *"--no-docker"* ]]; then
        print_status "Setting up Docker containers..."

        # Clean containers if requested
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

    # Run migrations
    print_status "Running database migrations..."
    npm run db:migrate

    # Seed database if requested
    if [[ "$*" != *"--no-seed"* ]]; then
        print_status "Seeding test database..."
        npm run db:seed:test
    fi
}

# Function to reset database
reset_database() {
    print_status "Resetting test database..."
    npm run db:reset:test
}

# Function to start test server
start_test_server() {
    local port=${1:-4700}

    print_status "Starting test server on port $port..."
    print_status "Application will be available at: http://localhost:$port"
    echo ""

    # Start the development server
    npm run dev -- -p $port
}

# Function to show test environment info
show_test_info() {
    echo ""
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  Test Environment Info${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo "Database: PostgreSQL (Docker container)"
    echo "Database Port: 5433"
    echo "Redis Port: 6380"
    echo "pgAdmin Port: 8081"
    echo "App Port: 4700 (or custom port)"
    echo ""
    echo "Access URLs:"
    echo "  Application: http://localhost:4700"
    echo "  API: http://localhost:4700/api"
    echo "  pgAdmin: http://localhost:8081"
    echo ""
    echo "Database Credentials:"
    echo "  Host: localhost"
    echo "  Port: 5433"
    echo "  Database: interview_platform_test"
    echo "  Username: postgres"
    echo "  Password: test_password_123"
    echo ""
    echo "pgAdmin Credentials:"
    echo "  Email: admin@interview-platform.com"
    echo "  Password: admin123"
    echo ""
    echo "Login Credentials:"
    echo "  Superadmin: superadmin@interview-platform.com / superadmin123"
    echo "  Admin: admin@interview-platform.com / admin123"
    echo ""
    echo "Useful Commands:"
    echo "  npm run db:studio    # Open Prisma Studio"
    echo "  docker logs interview-platform-postgres  # View database logs"
    echo "  docker logs interview-platform-redis     # View Redis logs"
    echo "  npm run docker:test:stop                 # Stop test containers"
}

# Function to check container status
check_containers() {
    print_status "Checking container status..."

    if ! docker ps | grep -q "interview-platform-postgres"; then
        print_warning "PostgreSQL container not running"
        return 1
    fi

    if ! docker ps | grep -q "interview-platform-redis"; then
        print_warning "Redis container not running"
        return 1
    fi

    print_status "All containers are running"
    return 0
}

# Main script logic
main() {
    print_header

    # Parse arguments
    local setup=false
    local reset=false
    local no_seed=false
    local no_docker=false
    local clean=false
    local port=4700

    while [[ $# -gt 0 ]]; do
        case $1 in
            --setup)
                setup=true
                shift
                ;;
            --reset)
                reset=true
                shift
                ;;
            --no-seed)
                no_seed=true
                shift
                ;;
            --no-docker)
                no_docker=true
                shift
                ;;
            --clean)
                clean=true
                shift
                ;;
            --port)
                port="$2"
                shift 2
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done

    # Check prerequisites
    check_prerequisites

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi

    # Check container status if not setting up
    if [ "$setup" = false ] && [ "$no_docker" = false ]; then
        if ! check_containers; then
            print_warning "Containers not running. Setting up environment..."
            setup=true
        fi
    fi

    # Setup environment if requested or needed
    if [ "$setup" = true ] || ! check_environment; then
        setup_test_environment $no_seed $clean
    fi

    # Reset database if requested
    if [ "$reset" = true ]; then
        reset_database
    fi

    # Show test environment info
    show_test_info

    # Start test server
    start_test_server $port
}

# Run main function with all arguments
main "$@"
