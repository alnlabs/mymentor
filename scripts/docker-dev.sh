#!/bin/bash

# Development Environment Management Script
# This script manages the development environment with Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       - Start development environment"
    echo "  stop        - Stop development environment"
    echo "  restart     - Restart development environment"
    echo "  status      - Show status of services"
    echo "  logs        - Show logs from all services"
    echo "  logs [SERVICE] - Show logs from specific service"
    echo "  shell       - Open shell in postgres container"
    echo "  backup      - Create database backup"
    echo "  seed        - Seed the development database"
    echo "  reset       - Reset development environment (WARNING: This will delete all data)"
    echo "  clean       - Clean up containers and volumes"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs postgres"
    echo "  $0 shell"
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."

    # Load environment variables
    if [ -f "env.development" ]; then
        export $(cat env.development | grep -v '^#' | xargs)
    fi

    # Start services
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

    print_success "Development environment started!"
    print_status "Services available at:"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Redis: localhost:6379"
    echo "  - pgAdmin: http://localhost:8080"
    echo "  - MailHog: http://localhost:8025"
    echo ""
    print_status "Database connection:"
    echo "  - URL: postgresql://postgres:dev_password_123@localhost:5432/interview_platform_dev"
}

# Function to stop development environment
stop_dev() {
    print_status "Stopping development environment..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
    print_success "Development environment stopped!"
}

# Function to restart development environment
restart_dev() {
    print_status "Restarting development environment..."
    stop_dev
    sleep 2
    start_dev
}

# Function to show status
show_status() {
    print_status "Development environment status:"
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps
}

# Function to show logs
show_logs() {
    if [ -z "$1" ]; then
        print_status "Showing logs from all services..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
    else
        print_status "Showing logs from $1..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f "$1"
    fi
}

# Function to open shell in postgres
open_shell() {
    print_status "Opening shell in postgres container..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec postgres psql -U postgres -d interview_platform_dev
}

# Function to create backup
create_backup() {
    print_status "Creating database backup..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backup
    print_success "Backup created!"
}

# Function to seed database
seed_database() {
    print_status "Seeding development database..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml --profile seed up seed-dev
    print_success "Database seeded!"
}

# Function to reset environment
reset_dev() {
    print_warning "This will delete all data in the development environment!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting development environment..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
        print_success "Development environment reset!"
    else
        print_status "Reset cancelled."
    fi
}

# Function to clean up
clean_dev() {
    print_warning "This will remove all containers and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up development environment..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Main script logic
case "${1:-help}" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    restart)
        restart_dev
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    shell)
        open_shell
        ;;
    backup)
        create_backup
        ;;
    seed)
        seed_database
        ;;
    reset)
        reset_dev
        ;;
    clean)
        clean_dev
        ;;
    help|*)
        show_usage
        ;;
esac
