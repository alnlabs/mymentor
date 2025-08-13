export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  READ_ONLY = "READ_ONLY",
}

export enum DatabaseOperation {
  READ = "READ",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  MIGRATE = "MIGRATE",
  RESET = "RESET",
  BACKUP = "BACKUP",
}

export interface Permission {
  operation: DatabaseOperation;
  resources: string[];
  allowed: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    { operation: DatabaseOperation.READ, resources: ["*"], allowed: true },
    {
      operation: DatabaseOperation.CREATE,
      resources: ["submissions", "userProgress"],
      allowed: true,
    },
    {
      operation: DatabaseOperation.UPDATE,
      resources: ["userProgress"],
      allowed: true,
    },
    { operation: DatabaseOperation.DELETE, resources: [], allowed: false },
    { operation: DatabaseOperation.MIGRATE, resources: [], allowed: false },
    { operation: DatabaseOperation.RESET, resources: [], allowed: false },
    { operation: DatabaseOperation.BACKUP, resources: [], allowed: false },
  ],
  [UserRole.ADMIN]: [
    { operation: DatabaseOperation.READ, resources: ["*"], allowed: true },
    { operation: DatabaseOperation.CREATE, resources: ["*"], allowed: true },
    { operation: DatabaseOperation.UPDATE, resources: ["*"], allowed: true },
    {
      operation: DatabaseOperation.DELETE,
      resources: ["users", "questions", "problems"],
      allowed: true,
    },
    { operation: DatabaseOperation.MIGRATE, resources: [], allowed: false },
    { operation: DatabaseOperation.RESET, resources: [], allowed: false },
    { operation: DatabaseOperation.BACKUP, resources: ["*"], allowed: true },
  ],
  [UserRole.SUPER_ADMIN]: [
    { operation: DatabaseOperation.READ, resources: ["*"], allowed: true },
    { operation: DatabaseOperation.CREATE, resources: ["*"], allowed: true },
    { operation: DatabaseOperation.UPDATE, resources: ["*"], allowed: true },
    { operation: DatabaseOperation.DELETE, resources: ["*"], allowed: true },
    { operation: DatabaseOperation.MIGRATE, resources: ["*"], allowed: true },
    { operation: DatabaseOperation.RESET, resources: ["*"], allowed: true },
    { operation: DatabaseOperation.BACKUP, resources: ["*"], allowed: true },
  ],
  [UserRole.READ_ONLY]: [
    { operation: DatabaseOperation.READ, resources: ["*"], allowed: true },
    { operation: DatabaseOperation.CREATE, resources: [], allowed: false },
    { operation: DatabaseOperation.UPDATE, resources: [], allowed: false },
    { operation: DatabaseOperation.DELETE, resources: [], allowed: false },
    { operation: DatabaseOperation.MIGRATE, resources: [], allowed: false },
    { operation: DatabaseOperation.RESET, resources: [], allowed: false },
    { operation: DatabaseOperation.BACKUP, resources: [], allowed: false },
  ],
};

export function hasPermission(
  userRole: UserRole,
  operation: DatabaseOperation,
  resource?: string
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  const permission = permissions.find((p) => p.operation === operation);

  if (!permission || !permission.allowed) {
    return false;
  }

  if (
    resource &&
    !permission.resources.includes("*") &&
    !permission.resources.includes(resource)
  ) {
    return false;
  }

  return true;
}

export function requirePermission(
  userRole: UserRole,
  operation: DatabaseOperation,
  resource?: string
): void {
  if (!hasPermission(userRole, operation, resource)) {
    throw new Error(
      `Access denied: ${userRole} cannot perform ${operation} on ${
        resource || "any resource"
      }`
    );
  }
}

// Special dangerous operations that require confirmation
export const DANGEROUS_OPERATIONS = [
  DatabaseOperation.RESET,
  DatabaseOperation.MIGRATE,
  DatabaseOperation.DELETE,
];

export function isDangerousOperation(operation: DatabaseOperation): boolean {
  return DANGEROUS_OPERATIONS.includes(operation);
}

export function requireConfirmation(operation: DatabaseOperation): boolean {
  return isDangerousOperation(operation);
}
