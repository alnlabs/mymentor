#!/bin/bash

# MyMentor Mock Data Cleanup Script
# This script removes all mock data files to provide a clean project structure

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
    echo -e "${BLUE}  MyMentor Mock Data Cleanup${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --dry-run    - Show what would be deleted without actually deleting"
    echo "  --backup     - Create backup before deletion"
    echo "  --help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Clean up all mock data"
    echo "  $0 --dry-run          # Show what would be deleted"
    echo "  $0 --backup           # Create backup and clean up"
}

# Function to create backup
create_backup() {
    local backup_dir="backups/mock-data-$(date +%Y%m%d-%H%M%S)"
    print_status "Creating backup in $backup_dir..."

    mkdir -p "$backup_dir"

    # Backup seed data
    if [ -d "data/seeds" ]; then
        cp -r data/seeds "$backup_dir/"
        print_status "Backed up data/seeds/"
    fi

    # Backup bulk import files
    for file in *.json; do
        if [[ "$file" == *"bulk-import"* ]] || [[ "$file" == *"mock"* ]] || [[ "$file" == *"sample"* ]] || [[ "$file" == *"test"* ]] || [[ "$file" == *"demo"* ]]; then
            cp "$file" "$backup_dir/"
            print_status "Backed up $file"
        fi
    done

    print_status "Backup completed: $backup_dir"
}

# Function to list files that would be deleted
list_files_to_delete() {
    print_status "Files that would be deleted:"
    echo ""

    # List seed data files
    if [ -d "data/seeds" ]; then
        echo "📁 data/seeds/ directory:"
        find data/seeds -type f -name "*.json" | while read file; do
            echo "  - $file"
        done
        echo ""
    fi

    # List bulk import files
    echo "📄 Bulk import files:"
    for file in *.json; do
        if [[ "$file" == *"bulk-import"* ]] || [[ "$file" == *"mock"* ]] || [[ "$file" == *"sample"* ]] || [[ "$file" == *"test"* ]] || [[ "$file" == *"demo"* ]]; then
            echo "  - $file"
        fi
    done
    echo ""
}

# Function to delete mock data
delete_mock_data() {
    print_status "Removing mock data files..."

    # Remove seed data directory
    if [ -d "data/seeds" ]; then
        rm -rf data/seeds
        print_status "Removed data/seeds/ directory"
    fi

    # Remove bulk import files
    local deleted_count=0
    for file in *.json; do
        if [[ "$file" == *"bulk-import"* ]] || [[ "$file" == *"mock"* ]] || [[ "$file" == *"sample"* ]] || [[ "$file" == *"test"* ]] || [[ "$file" == *"demo"* ]]; then
            rm "$file"
            print_status "Removed $file"
            ((deleted_count++))
        fi
    done

    print_status "Deleted $deleted_count bulk import files"
}

# Function to create clean seed structure
create_clean_seed_structure() {
    print_status "Creating clean seed structure..."

    # Create minimal seed directory structure
    mkdir -p data/seeds/{java,javascript,python,metadata}

    # Create README for seeds
    cat > data/seeds/README.md << 'EOF'
# Seed Data Directory

This directory contains seed data for the MyMentor application.

## Structure

- `java/` - Java programming questions and problems
- `javascript/` - JavaScript programming questions and problems
- `python/` - Python programming questions and problems
- `metadata/` - Metadata files for organizing seed data

## Adding New Seed Data

1. Create JSON files in the appropriate language directory
2. Follow the established schema for questions/problems
3. Update metadata files as needed
4. Use the admin interface to import new data

## File Formats

- MCQ questions: `{question, options, correctAnswer, explanation, category, difficulty}`
- Problems: `{title, description, difficulty, category, testCases, solution, hints}`
- Metadata: `{name, description, concepts, categories}`
EOF

    print_status "Created clean seed structure with README"
}

# Function to update package.json scripts
update_package_scripts() {
    print_status "Updating package.json scripts..."

    # Remove seed-related scripts that reference mock data
    if [ -f "package.json" ]; then
        # This would require more complex JSON manipulation
        # For now, just inform the user
        print_warning "Please manually review package.json and remove any scripts that reference mock data files"
    fi
}

# Main script logic
main() {
    print_header

    # Parse arguments
    local dry_run=false
    local create_backup_flag=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                dry_run=true
                shift
                ;;
            --backup)
                create_backup_flag=true
                shift
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

    # Show what will be deleted
    list_files_to_delete

    if [ "$dry_run" = true ]; then
        print_status "Dry run completed. No files were deleted."
        exit 0
    fi

    # Ask for confirmation
    echo ""
    read -p "Are you sure you want to delete all mock data? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleanup cancelled."
        exit 0
    fi

    # Create backup if requested
    if [ "$create_backup_flag" = true ]; then
        create_backup
    fi

    # Delete mock data
    delete_mock_data

    # Create clean structure
    create_clean_seed_structure

    # Update scripts
    update_package_scripts

    echo ""
    print_status "Mock data cleanup completed successfully!"
    print_status "Clean seed structure created in data/seeds/"
    echo ""
    print_warning "Next steps:"
    echo "1. Review and update any scripts that referenced the deleted files"
    echo "2. Add your own seed data to the data/seeds/ directory"
    echo "3. Use the admin interface to import new data"
}

# Run main function with all arguments
main "$@"
