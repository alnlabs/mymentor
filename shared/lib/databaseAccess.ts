import { PrismaClient } from "@prisma/client";
import {
  UserRole,
  DatabaseOperation,
  requirePermission,
  isDangerousOperation,
} from "../utils/roles";

// Singleton Prisma client
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export interface DatabaseAccessContext {
  userRole: UserRole;
  userId?: string;
  operation: DatabaseOperation;
  resource?: string;
  requiresConfirmation?: boolean;
}

export class DatabaseAccessController {
  private static instance: DatabaseAccessController;
  private confirmationTokens: Map<
    string,
    { operation: DatabaseOperation; timestamp: number }
  > = new Map();

  static getInstance(): DatabaseAccessController {
    if (!DatabaseAccessController.instance) {
      DatabaseAccessController.instance = new DatabaseAccessController();
    }
    return DatabaseAccessController.instance;
  }

  // Check if user can perform operation
  canPerformOperation(context: DatabaseAccessContext): boolean {
    try {
      requirePermission(context.userRole, context.operation, context.resource);
      return true;
    } catch {
      return false;
    }
  }

  // Require permission or throw error
  requirePermission(context: DatabaseAccessContext): void {
    requirePermission(context.userRole, context.operation, context.resource);
  }

  // Generate confirmation token for dangerous operations
  generateConfirmationToken(operation: DatabaseOperation): string {
    const token = Math.random().toString(36).substring(2, 15);
    this.confirmationTokens.set(token, {
      operation,
      timestamp: Date.now(),
    });

    // Clean up old tokens (older than 5 minutes)
    setTimeout(() => {
      this.confirmationTokens.delete(token);
    }, 5 * 60 * 1000);

    return token;
  }

  // Verify confirmation token
  verifyConfirmationToken(
    token: string,
    operation: DatabaseOperation
  ): boolean {
    const stored = this.confirmationTokens.get(token);
    if (!stored) return false;

    if (stored.operation !== operation) return false;

    // Check if token is not expired (5 minutes)
    if (Date.now() - stored.timestamp > 5 * 60 * 1000) {
      this.confirmationTokens.delete(token);
      return false;
    }

    // Remove token after use
    this.confirmationTokens.delete(token);
    return true;
  }

  // Log database operations
  logOperation(
    context: DatabaseAccessContext,
    success: boolean,
    details?: any
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userRole: context.userRole,
      userId: context.userId,
      operation: context.operation,
      resource: context.resource,
      success,
      details,
      ip: process.env.REMOTE_ADDR || "unknown",
    };

    console.log("DATABASE_ACCESS_LOG:", JSON.stringify(logEntry));

    // In production, you might want to store this in a separate audit log table
    if (process.env.NODE_ENV === "production") {
      // TODO: Store in audit log table
    }
  }
}

// Wrapper for Prisma operations with access control
export function withAccessControl<T>(
  context: DatabaseAccessContext,
  operation: () => Promise<T>,
  confirmationToken?: string
): Promise<T> {
  const controller = DatabaseAccessController.getInstance();

  // Check basic permissions
  controller.requirePermission(context);

  // For dangerous operations, require confirmation
  if (isDangerousOperation(context.operation)) {
    if (!confirmationToken) {
      throw new Error(
        `Confirmation required for dangerous operation: ${context.operation}`
      );
    }

    if (
      !controller.verifyConfirmationToken(confirmationToken, context.operation)
    ) {
      throw new Error("Invalid or expired confirmation token");
    }
  }

  // Log the operation attempt
  controller.logOperation(context, true, {
    confirmationToken: !!confirmationToken,
  });

  // Execute the operation
  return operation().catch((error) => {
    controller.logOperation(context, false, { error: error.message });
    throw error;
  });
}

// Safe database access functions
export const safeDb = {
  // Read operations
  findMany: <T>(
    context: DatabaseAccessContext,
    operation: () => Promise<T[]>
  ): Promise<T[]> => {
    return withAccessControl(context, operation);
  },

  findUnique: <T>(
    context: DatabaseAccessContext,
    operation: () => Promise<T | null>
  ): Promise<T | null> => {
    return withAccessControl(context, operation);
  },

  // Write operations
  create: <T>(
    context: DatabaseAccessContext,
    operation: () => Promise<T>
  ): Promise<T> => {
    return withAccessControl(context, operation);
  },

  update: <T>(
    context: DatabaseAccessContext,
    operation: () => Promise<T>
  ): Promise<T> => {
    return withAccessControl(context, operation);
  },

  delete: <T>(
    context: DatabaseAccessContext,
    operation: () => Promise<T>,
    confirmationToken?: string
  ): Promise<T> => {
    return withAccessControl(context, operation, confirmationToken);
  },

  // Dangerous operations
  migrate: (
    context: DatabaseAccessContext,
    operation: () => Promise<any>,
    confirmationToken?: string
  ): Promise<any> => {
    return withAccessControl(context, operation, confirmationToken);
  },

  reset: (
    context: DatabaseAccessContext,
    operation: () => Promise<any>,
    confirmationToken?: string
  ): Promise<any> => {
    return withAccessControl(context, operation, confirmationToken);
  },
};

export { prisma };
