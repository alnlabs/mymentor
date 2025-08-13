# Database Access Control Guide

## Overview

This guide explains the comprehensive database access control system implemented to prevent dangerous operations and ensure data safety.

## 🔐 Access Control Layers

### 1. **Role-Based Access Control (RBAC)**

Different user roles have different permissions:

#### **Student Role**

- ✅ **READ**: All resources
- ✅ **CREATE**: submissions, userProgress
- ✅ **UPDATE**: userProgress
- ❌ **DELETE**: Nothing
- ❌ **MIGRATE**: Nothing
- ❌ **RESET**: Nothing
- ❌ **BACKUP**: Nothing

#### **Admin Role**

- ✅ **READ**: All resources
- ✅ **CREATE**: All resources
- ✅ **UPDATE**: All resources
- ✅ **DELETE**: users, questions, problems
- ❌ **MIGRATE**: Nothing
- ❌ **RESET**: Nothing
- ✅ **BACKUP**: All resources

#### **Super Admin Role**

- ✅ **READ**: All resources
- ✅ **CREATE**: All resources
- ✅ **UPDATE**: All resources
- ✅ **DELETE**: All resources
- ✅ **MIGRATE**: All resources
- ✅ **RESET**: All resources
- ✅ **BACKUP**: All resources

#### **Read-Only Role**

- ✅ **READ**: All resources
- ❌ **CREATE**: Nothing
- ❌ **UPDATE**: Nothing
- ❌ **DELETE**: Nothing
- ❌ **MIGRATE**: Nothing
- ❌ **RESET**: Nothing
- ❌ **BACKUP**: Nothing

### 2. **Environment-Based Restrictions**

Different environments have different safety levels:

#### **Production Environment**

```javascript
{
  allowReset: false,        // ❌ No database resets
  allowMigrate: false,      // ❌ No migrations
  allowDelete: true,        // ✅ Deletes allowed
  requireBackup: true,      // ✅ Backup required before dangerous ops
  maxDeleteCount: 100       // 🔢 Max 100 records per delete
}
```

#### **Development Environment**

```javascript
{
  allowReset: true,         // ✅ Resets allowed
  allowMigrate: true,       // ✅ Migrations allowed
  allowDelete: true,        // ✅ Deletes allowed
  requireBackup: false,     // ❌ No backup required
  maxDeleteCount: 1000      // 🔢 Max 1000 records per delete
}
```

#### **Test Environment**

```javascript
{
  allowReset: true,         // ✅ Resets allowed
  allowMigrate: true,       // ✅ Migrations allowed
  allowDelete: true,        // ✅ Deletes allowed
  requireBackup: false,     // ❌ No backup required
  maxDeleteCount: 10000     // 🔢 Max 10000 records per delete
}
```

### 3. **Confirmation Tokens for Dangerous Operations**

Dangerous operations require confirmation tokens:

```javascript
// Generate confirmation token
const token = controller.generateConfirmationToken(DatabaseOperation.RESET);

// Use token in API call
DELETE /api/admin/users/123?confirmationToken=abc123
```

**Dangerous Operations:**

- `RESET` - Database reset
- `MIGRATE` - Schema migrations
- `DELETE` - Record deletion

### 4. **Audit Logging**

All database operations are logged:

```javascript
{
  "timestamp": "2025-08-13T10:27:34.758Z",
  "userRole": "ADMIN",
  "userId": "admin123",
  "operation": "DELETE",
  "resource": "users",
  "success": true,
  "details": { "confirmationToken": true },
  "ip": "192.168.1.100"
}
```

## 🛡️ Implementation Examples

### **Safe Database Access**

```typescript
import { safeDb, DatabaseOperation, UserRole } from "@/shared/lib/database";

// Safe read operation
const users = await safeDb.findMany(
  {
    userRole: UserRole.ADMIN,
    userId: "admin123",
    operation: DatabaseOperation.READ,
    resource: "users",
  },
  () => prisma.user.findMany()
);

// Safe delete operation with confirmation
const result = await safeDb.delete(
  {
    userRole: UserRole.ADMIN,
    userId: "admin123",
    operation: DatabaseOperation.DELETE,
    resource: "users",
  },
  () => prisma.user.delete({ where: { id } }),
  confirmationToken
);
```

### **API Route Protection**

```typescript
export async function DELETE(request: NextRequest, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const confirmationToken = searchParams.get("confirmationToken");

    const result = await safeDb.delete(
      {
        userRole: UserRole.ADMIN,
        userId: "admin123",
        operation: DatabaseOperation.DELETE,
        resource: "users",
      },
      async () => {
        // Your delete logic here
        return await prisma.user.delete({ where: { id } });
      },
      confirmationToken
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error.message.includes("Confirmation required")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          requiresConfirmation: true,
        },
        { status: 400 }
      );
    }
    // Handle other errors...
  }
}
```

## 🚨 Safety Features

### **1. Automatic Backups**

- Backups created before dangerous operations in production
- Timestamped backup files
- Configurable backup requirements

### **2. Delete Limits**

- Maximum records per delete operation
- Environment-specific limits
- Prevents accidental mass deletions

### **3. Confirmation Tokens**

- Time-limited tokens (5 minutes)
- One-time use
- Required for dangerous operations

### **4. Environment Restrictions**

- Production: No resets or migrations
- Development: Full access for testing
- Test: Full access with higher limits

### **5. Comprehensive Logging**

- All operations logged
- Success/failure tracking
- User and IP tracking
- Detailed error information

## 🔧 Configuration

### **Environment Variables**

```bash
NODE_ENV=production  # Controls environment restrictions
```

### **Role Configuration**

```typescript
// In shared/utils/roles.ts
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    {
      operation: DatabaseOperation.DELETE,
      resources: ["users", "questions"],
      allowed: true,
    },
  ],
};
```

### **Environment Restrictions**

```typescript
// In shared/lib/database.ts
const ENVIRONMENT_RESTRICTIONS = {
  production: {
    allowReset: false,
    maxDeleteCount: 100,
  },
};
```

## 🧪 Testing

Run the access control demo:

```bash
node scripts/database-access-demo.js
```

This will test various scenarios and show how the access controls work.

## 📋 Best Practices

### **1. Always Use Safe Database Access**

```typescript
// ❌ Don't do this
await prisma.user.delete({ where: { id } });

// ✅ Do this instead
await safeDb.delete(context, () => prisma.user.delete({ where: { id } }));
```

### **2. Check Permissions First**

```typescript
// Check if user can perform operation
if (!hasPermission(userRole, operation, resource)) {
  throw new Error("Access denied");
}
```

### **3. Require Confirmation for Dangerous Operations**

```typescript
// Always require confirmation for dangerous operations
if (isDangerousOperation(operation) && !confirmationToken) {
  throw new Error("Confirmation required");
}
```

### **4. Log All Operations**

```typescript
// Log successful operations
logOperation(context, true);

// Log failed operations with error details
logOperation(context, false, { error: error.message });
```

### **5. Use Environment-Specific Settings**

```typescript
// Different behavior in different environments
if (process.env.NODE_ENV === "production") {
  // Stricter controls
} else {
  // More permissive for development
}
```

## 🚀 Migration Guide

### **From Unprotected to Protected**

1. **Replace direct Prisma calls:**

```typescript
// Before
const users = await prisma.user.findMany();

// After
const users = await safeDb.findMany(context, () => prisma.user.findMany());
```

2. **Add permission checks:**

```typescript
// Before
export async function DELETE(request, { params }) {
  await prisma.user.delete({ where: { id } });
}

// After
export async function DELETE(request, { params }) {
  const result = await safeDb.delete(
    context,
    () => prisma.user.delete({ where: { id } }),
    confirmationToken
  );
}
```

3. **Add confirmation tokens:**

```typescript
// Generate token for dangerous operations
const token = controller.generateConfirmationToken(DatabaseOperation.DELETE);

// Use in API call
DELETE /api/users/123?confirmationToken=abc123
```

## 🔍 Monitoring and Debugging

### **Check Access Logs**

```bash
# Look for database access logs
grep "DATABASE_ACCESS_LOG" logs/app.log
```

### **Test Permissions**

```typescript
// Test if user has permission
const canDelete = hasPermission(
  UserRole.ADMIN,
  DatabaseOperation.DELETE,
  "users"
);
console.log("Can delete users:", canDelete);
```

### **Verify Environment Restrictions**

```typescript
// Check current environment restrictions
const restrictions = getEnvironmentRestrictions();
console.log("Current restrictions:", restrictions);
```

## 🛠️ Troubleshooting

### **Common Issues**

1. **"Access denied" errors**

   - Check user role permissions
   - Verify resource access rights
   - Ensure proper authentication

2. **"Confirmation required" errors**

   - Generate confirmation token
   - Include token in API request
   - Check token expiration (5 minutes)

3. **"Environment restriction" errors**

   - Check NODE_ENV setting
   - Verify operation is allowed in current environment
   - Use appropriate environment for testing

4. **"Delete count exceeds limit" errors**
   - Reduce number of records being deleted
   - Use batch operations if needed
   - Check environment-specific limits

### **Debug Commands**

```bash
# Test access control system
node scripts/database-access-demo.js

# Check current environment
echo $NODE_ENV

# View recent logs
tail -f logs/app.log | grep DATABASE_ACCESS_LOG
```

This comprehensive access control system ensures your database remains safe and secure while providing the flexibility needed for development and testing.
