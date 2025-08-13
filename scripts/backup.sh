#!/bin/sh

# Database backup script
# This script creates a timestamped backup of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="interview_platform_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating database backup: $BACKUP_FILE"
pg_dump \
  -h "$POSTGRES_HOST" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  --verbose \
  --clean \
  --no-owner \
  --no-privileges \
  --format=custom \
  --file="$BACKUP_DIR/$BACKUP_FILE"

# Compress the backup
echo "Compressing backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE"

# Keep only the last 7 backups
echo "Cleaning old backups (keeping last 7)..."
cd "$BACKUP_DIR"
ls -t *.sql.gz | tail -n +8 | xargs -r rm

echo "Backup completed: $BACKUP_FILE.gz"
echo "Backup size: $(du -h "$BACKUP_DIR/$BACKUP_FILE.gz" | cut -f1)"
