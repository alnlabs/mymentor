#!/bin/bash

# MyMentor Development Environment Runner
# Usage: ./run-dev.sh [options]

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
    echo -e "${BLUE}  MyMentor Development Runner${NC}"
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
    echo "  --port PORT  - Use custom port (default: 4700)"
    echo "  --help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run development server"
    echo "  $0 --setup            # Setup and run"
    echo "  $0 --reset            # Reset database and run"
    echo "  $0 --port 3000        # Run on port 3000"
    echo "  $0 --setup --no-seed  # Setup without seeding"
}

# Function to check if environment is set up
check_environment() {
    if [ ! -f ".env" ]; then
        print_warning "No .env file found. Setting up development environment..."
        return 1
    fi

    # Check if it's a development environment
    if grep -q "NODE_ENV=development" .env 2>/dev/null || grep -q "SQLite" .env 2>/dev/null; then
        print_status "Development environment detected"
        return 0
    else
        print_warning "Current environment doesn't appear to be development"
        return 1
    fi
}

# Function to setup development environment
setup_dev_environment() {
    print_status "Setting up development environment..."

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
    if [[ "$*" != *"--no-seed"* ]]; then
        print_status "Seeding development database..."
        npm run db:seed
    fi
}

# Function to reset database
reset_database() {
    print_status "Resetting development database..."
    npm run db:reset:dev
}

# Function to start development server
start_dev_server() {
    local port=${1:-4700}

    print_status "Starting development server on port $port..."
    print_status "Application will be available at: http://localhost:$port"
    echo ""

    # Start the development server
    npm run dev -- -p $port
}

# Function to show development info
show_dev_info() {
    echo ""
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  Development Environment Info${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo "Database: SQLite (dev.db)"
    echo "Port: 4700 (or custom port)"
    echo "Features: Hot reload, development mode"
    echo ""
    echo "Access URLs:"
    echo "  Application: http://localhost:4700"
    echo "  API: http://localhost:4700/api"
    echo ""
    echo "Login Credentials:"
    echo "  Superadmin: superadmin@interview-platform.com / superadmin123"
    echo "  Admin: admin@interview-platform.com / admin123"
    echo ""
    echo "Useful Commands:"
    echo "  npm run db:studio    # Open Prisma Studio"
    echo "  npm run lint         # Run ESLint"
    echo "  npm run build        # Build for production"
}

# Main script logic
main() {
    print_header

    # Parse arguments
    local setup=false
    local reset=false
    local no_seed=false
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
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi

    # Setup environment if requested or needed
    if [ "$setup" = true ] || ! check_environment; then
        setup_dev_environment $no_seed
    fi

    # Reset database if requested
    if [ "$reset" = true ]; then
        reset_database
    fi

    # Show development info
    show_dev_info

    # Start development server
    start_dev_server $port
}

# Run main function with all arguments
main "$@"
