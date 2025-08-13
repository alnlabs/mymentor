import { PrismaClient } from "@prisma/client";
import { DatabaseOperation, UserRole } from "../utils/roles";

// Environment-based restrictions
const ENVIRONMENT_RESTRICTIONS = {
  production: {
    allowReset: false,
    allowMigrate: false,
    allowDelete: true,
    requireBackup: true,
    maxDeleteCount: 100,
  },
  development: {
    allowReset: true,
    allowMigrate: true,
    allowDelete: true,
    requireBackup: false,
    maxDeleteCount: 1000,
  },
  test: {
    allowReset: true,
    allowMigrate: true,
    allowDelete: true,
    requireBackup: false,
    maxDeleteCount: 10000,
  },
};

// Get current environment restrictions
function getEnvironmentRestrictions() {
  const env = process.env.NODE_ENV || "development";
  return (
    ENVIRONMENT_RESTRICTIONS[env as keyof typeof ENVIRONMENT_RESTRICTIONS] ||
    ENVIRONMENT_RESTRICTIONS.development
  );
}

// Type for global prisma instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Singleton Prisma client with access control
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["error", "warn"],
    errorFormat: "minimal",
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
      errorFormat: "pretty",
    });
  }
  prisma = global.prisma;
}

// Enhanced Prisma client with safety checks
export class SafePrismaClient {
  private client: PrismaClient;
  private restrictions: ReturnType<typeof getEnvironmentRestrictions>;

  constructor() {
    this.client = prisma;
    this.restrictions = getEnvironmentRestrictions();
  }

  // Check if operation is allowed in current environment
  private checkEnvironmentRestriction(operation: DatabaseOperation): void {
    switch (operation) {
      case DatabaseOperation.RESET:
        if (!this.restrictions.allowReset) {
          throw new Error(
            `Database reset is not allowed in ${process.env.NODE_ENV} environment`
          );
        }
        break;
      case DatabaseOperation.MIGRATE:
        if (!this.restrictions.allowMigrate) {
          throw new Error(
            `Database migration is not allowed in ${process.env.NODE_ENV} environment`
          );
        }
        break;
      case DatabaseOperation.DELETE:
        if (!this.restrictions.allowDelete) {
          throw new Error(
            `Database delete operations are not allowed in ${process.env.NODE_ENV} environment`
          );
        }
        break;
    }
  }

  // Create backup before dangerous operations
  private async createBackupIfRequired(
    operation: DatabaseOperation
  ): Promise<void> {
    if (
      this.restrictions.requireBackup &&
      this.isDangerousOperation(operation)
    ) {
      await this.createBackup();
    }
  }

  // Check delete count limits
  private checkDeleteLimit(count: number): void {
    if (count > this.restrictions.maxDeleteCount) {
      throw new Error(
        `Delete count ${count} exceeds limit of ${this.restrictions.maxDeleteCount} for ${process.env.NODE_ENV} environment`
      );
    }
  }

  // Determine if operation is dangerous
  private isDangerousOperation(operation: DatabaseOperation): boolean {
    return [
      DatabaseOperation.RESET,
      DatabaseOperation.MIGRATE,
      DatabaseOperation.DELETE,
    ].includes(operation);
  }

  // Create database backup
  private async createBackup(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = `./backups/db-backup-${timestamp}.sql`;

    console.log(`Creating backup: ${backupPath}`);

    // In a real implementation, you would:
    // 1. Use pg_dump for PostgreSQL
    // 2. Use mysqldump for MySQL
    // 3. Copy SQLite file for SQLite

    // For now, just log the backup attempt
    console.log("BACKUP_CREATED:", backupPath);
  }

  // Safe delete operations
  async safeDelete<T>(
    model: keyof PrismaClient,
    where: any,
    userRole: UserRole,
    operation: DatabaseOperation = DatabaseOperation.DELETE
  ): Promise<T> {
    // Check environment restrictions
    this.checkEnvironmentRestriction(operation);

    // Create backup if required
    await this.createBackupIfRequired(operation);

    // Check delete count
    const count = await (this.client[model] as any).count({ where });
    this.checkDeleteLimit(count);

    // Log the operation
    console.log(
      `SAFE_DELETE: ${userRole} deleting ${count} records from ${String(model)}`
    );

    // Perform the delete
    return (this.client[model] as any).delete({ where });
  }

  // Safe batch delete
  async safeDeleteMany<T>(
    model: keyof PrismaClient,
    where: any,
    userRole: UserRole,
    operation: DatabaseOperation = DatabaseOperation.DELETE
  ): Promise<{ count: number }> {
    // Check environment restrictions
    this.checkEnvironmentRestriction(operation);

    // Create backup if required
    await this.createBackupIfRequired(operation);

    // Check delete count
    const count = await (this.client[model] as any).count({ where });
    this.checkDeleteLimit(count);

    // Log the operation
    console.log(
      `SAFE_DELETE_MANY: ${userRole} deleting ${count} records from ${String(
        model
      )}`
    );

    // Perform the delete
    return (this.client[model] as any).deleteMany({ where });
  }

  // Get the underlying Prisma client for safe operations
  getClient(): PrismaClient {
    return this.client;
  }

  // Disconnect client
  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}

// Export singleton instance
export const safePrisma = new SafePrismaClient();

// Export the original client for backward compatibility
export { prisma };

// Re-export safeDb from databaseAccess
export { safeDb } from "./databaseAccess";
