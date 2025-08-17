#!/bin/bash

# MyMentor Production Environment Runner
# Usage: ./run-prod.sh [options]

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
    echo -e "${BLUE}  MyMentor Production Runner${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --setup      - Setup environment before running"
    echo "  --build      - Build application before running"
    echo "  --no-docker  - Skip Docker container setup"
    echo "  --clean      - Clean containers before setup"
    echo "  --monitoring - Start monitoring stack"
    echo "  --port PORT  - Use custom port (default: 4700)"
    echo "  --help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run production environment"
    echo "  $0 --setup            # Setup and run"
    echo "  $0 --build            # Build and run"
    echo "  $0 --clean            # Clean containers and run"
    echo "  $0 --monitoring       # Run with monitoring"
    echo "  $0 --port 80          # Run on port 80"
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
        print_warning "No .env file found. Setting up production environment..."
        return 1
    fi

    # Check if it's a production environment
    if grep -q "NODE_ENV=production" .env 2>/dev/null; then
        print_status "Production environment detected"
        return 0
    else
        print_warning "Current environment doesn't appear to be production"
        return 1
    fi
}

# Function to setup production environment
setup_production_environment() {
    print_status "Setting up production environment..."

    # Copy production environment
    if [ -f "env.production" ]; then
        cp env.production .env
        print_status "Production environment configured"
    else
        print_error "env.production file not found!"
        exit 1
    fi

    # Setup Docker containers
    if [[ "$*" != *"--no-docker"* ]]; then
        print_status "Setting up production Docker containers..."

        # Clean containers if requested
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
}

# Function to build application
build_application() {
    print_status "Building application for production..."

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi

    # Build the application
    print_status "Building Next.js application..."
    npm run build

    print_status "Application built successfully!"
}

# Function to start production server
start_production_server() {
    local port=${1:-4700}

    print_status "Starting production server on port $port..."
    print_status "Application will be available at: http://localhost:$port"
    echo ""

    # Start the production server
    npm run start -- -p $port
}

# Function to start monitoring
start_monitoring() {
    print_status "Starting monitoring stack..."
    npm run docker:prod:monitoring

    print_status "Monitoring stack started!"
    print_status "Grafana: http://localhost:3000"
    print_status "Prometheus: http://localhost:9090"
}

# Function to show production environment info
show_production_info() {
    echo ""
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  Production Environment Info${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo "Database: PostgreSQL (Docker container)"
    echo "Redis: Docker container"
    echo "Monitoring: Grafana + Prometheus"
    echo "App Port: 4700 (or custom port)"
    echo ""
    echo "Access URLs:"
    echo "  Application: http://localhost:4700"
    echo "  API: http://localhost:4700/api"
    echo "  Grafana: http://localhost:3000"
    echo "  Prometheus: http://localhost:9090"
    echo ""
    echo "Security Notes:"
    echo "  - Review .env file for production values"
    echo "  - Ensure strong passwords are set"
    echo "  - Configure SSL/TLS certificates"
    echo "  - Set up proper firewall rules"
    echo ""
    echo "Useful Commands:"
    echo "  docker logs interview-platform-postgres  # View database logs"
    echo "  docker logs interview-platform-redis     # View Redis logs"
    echo "  npm run docker:prod:stop                 # Stop production containers"
    echo "  npm run docker:prod:monitoring           # Start monitoring stack"
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

# Function to security check
security_check() {
    print_warning "Security Check Required!"
    echo ""
    echo "Before running in production, please ensure:"
    echo "1. Strong passwords in .env file"
    echo "2. SSL/TLS certificates configured"
    echo "3. Firewall rules set up"
    echo "4. Database backups configured"
    echo "5. Monitoring and alerting set up"
    echo ""

    read -p "Have you completed the security setup? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Please complete security setup before running in production"
        exit 1
    fi
}

# Main script logic
main() {
    print_header

    # Parse arguments
    local setup=false
    local build=false
    local no_docker=false
    local clean=false
    local monitoring=false
    local port=4700

    while [[ $# -gt 0 ]]; do
        case $1 in
            --setup)
                setup=true
                shift
                ;;
            --build)
                build=true
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
            --monitoring)
                monitoring=true
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

    # Security check
    security_check

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
        setup_production_environment $no_docker $clean
    fi

    # Build application if requested
    if [ "$build" = true ]; then
        build_application
    fi

    # Start monitoring if requested
    if [ "$monitoring" = true ]; then
        start_monitoring
    fi

    # Show production environment info
    show_production_info

    # Start production server
    start_production_server $port
}

# Run main function with all arguments
main "$@"
