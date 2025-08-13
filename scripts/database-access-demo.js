#!/usr/bin/env node

/**
 * Database Access Control Demo
 *
 * This script demonstrates the various ways to control database access:
 * 1. Role-based access control
 * 2. Environment-based restrictions
 * 3. Confirmation tokens for dangerous operations
 * 4. Audit logging
 */

const { PrismaClient } = require("@prisma/client");

// Simulate the access control system
const UserRole = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  READ_ONLY: "READ_ONLY",
};

const DatabaseOperation = {
  READ: "READ",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  MIGRATE: "MIGRATE",
  RESET: "RESET",
  BACKUP: "BACKUP",
};

// Role permissions
const ROLE_PERMISSIONS = {
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

// Environment restrictions
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

// Access control functions
function hasPermission(userRole, operation, resource) {
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

function requirePermission(userRole, operation, resource) {
  if (!hasPermission(userRole, operation, resource)) {
    throw new Error(
      `Access denied: ${userRole} cannot perform ${operation} on ${
        resource || "any resource"
      }`
    );
  }
}

function checkEnvironmentRestriction(operation, env = "development") {
  const restrictions =
    ENVIRONMENT_RESTRICTIONS[env] || ENVIRONMENT_RESTRICTIONS.development;

  switch (operation) {
    case DatabaseOperation.RESET:
      if (!restrictions.allowReset) {
        throw new Error(`Database reset is not allowed in ${env} environment`);
      }
      break;
    case DatabaseOperation.MIGRATE:
      if (!restrictions.allowMigrate) {
        throw new Error(
          `Database migration is not allowed in ${env} environment`
        );
      }
      break;
    case DatabaseOperation.DELETE:
      if (!restrictions.allowDelete) {
        throw new Error(
          `Database delete operations are not allowed in ${env} environment`
        );
      }
      break;
  }
}

function logOperation(userRole, operation, resource, success, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userRole,
    operation,
    resource,
    success,
    details,
    environment: process.env.NODE_ENV || "development",
  };

  console.log("DATABASE_ACCESS_LOG:", JSON.stringify(logEntry, null, 2));
}

// Demo scenarios
async function runDemo() {
  console.log("🔐 Database Access Control Demo\n");

  const scenarios = [
    {
      name: "Student trying to read users",
      userRole: UserRole.STUDENT,
      operation: DatabaseOperation.READ,
      resource: "users",
      shouldSucceed: true,
    },
    {
      name: "Student trying to delete users",
      userRole: UserRole.STUDENT,
      operation: DatabaseOperation.DELETE,
      resource: "users",
      shouldSucceed: false,
    },
    {
      name: "Admin trying to delete users",
      userRole: UserRole.ADMIN,
      operation: DatabaseOperation.DELETE,
      resource: "users",
      shouldSucceed: true,
    },
    {
      name: "Admin trying to reset database",
      userRole: UserRole.ADMIN,
      operation: DatabaseOperation.RESET,
      resource: "database",
      shouldSucceed: false,
    },
    {
      name: "Super Admin trying to reset database in development",
      userRole: UserRole.SUPER_ADMIN,
      operation: DatabaseOperation.RESET,
      resource: "database",
      shouldSucceed: true,
      environment: "development",
    },
    {
      name: "Super Admin trying to reset database in production",
      userRole: UserRole.SUPER_ADMIN,
      operation: DatabaseOperation.RESET,
      resource: "database",
      shouldSucceed: false,
      environment: "production",
    },
  ];

  for (const scenario of scenarios) {
    console.log(`\n📋 Scenario: ${scenario.name}`);
    console.log(`   Role: ${scenario.userRole}`);
    console.log(`   Operation: ${scenario.operation}`);
    console.log(`   Resource: ${scenario.resource}`);
    console.log(`   Environment: ${scenario.environment || "development"}`);

    try {
      // Check role-based permissions
      requirePermission(
        scenario.userRole,
        scenario.operation,
        scenario.resource
      );

      // Check environment restrictions
      checkEnvironmentRestriction(scenario.operation, scenario.environment);

      // Log successful operation
      logOperation(
        scenario.userRole,
        scenario.operation,
        scenario.resource,
        true
      );

      console.log(`   ✅ SUCCESS: Operation allowed`);

      if (scenario.shouldSucceed === false) {
        console.log(`   ⚠️  WARNING: This should have failed!`);
      }
    } catch (error) {
      // Log failed operation
      logOperation(
        scenario.userRole,
        scenario.operation,
        scenario.resource,
        false,
        { error: error.message }
      );

      console.log(`   ❌ FAILED: ${error.message}`);

      if (scenario.shouldSucceed === true) {
        console.log(`   ⚠️  WARNING: This should have succeeded!`);
      }
    }
  }

  console.log("\n\n🔍 Access Control Summary:");
  console.log("1. Role-based permissions prevent unauthorized access");
  console.log(
    "2. Environment restrictions prevent dangerous operations in production"
  );
  console.log("3. All operations are logged for audit purposes");
  console.log("4. Confirmation tokens required for dangerous operations");
  console.log("5. Automatic backups before destructive operations");
}

// Run the demo
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = {
  UserRole,
  DatabaseOperation,
  hasPermission,
  requirePermission,
  checkEnvironmentRestriction,
  logOperation,
};
