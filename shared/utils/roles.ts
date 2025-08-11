export type UserRole = 'superadmin' | 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

export const ROLES = {
  SUPERADMIN: 'superadmin' as const,
  ADMIN: 'admin' as const,
  USER: 'user' as const,
} as const;

export const ROLE_HIERARCHY = {
  [ROLES.SUPERADMIN]: 3,
  [ROLES.ADMIN]: 2,
  [ROLES.USER]: 1,
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.SUPERADMIN]: {
    canManageUsers: true,
    canManageAdmins: true,
    canUploadContent: true,
    canDeleteContent: true,
    canViewAnalytics: true,
    canManageSystem: true,
    canSolveProblems: true,
    canTakeMCQs: true,
  },
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canManageAdmins: false,
    canUploadContent: true,
    canDeleteContent: true,
    canViewAnalytics: true,
    canManageSystem: false,
    canSolveProblems: true,
    canTakeMCQs: true,
  },
  [ROLES.USER]: {
    canManageUsers: false,
    canManageAdmins: false,
    canUploadContent: false,
    canDeleteContent: false,
    canViewAnalytics: false,
    canManageSystem: false,
    canSolveProblems: true,
    canTakeMCQs: true,
  },
} as const;

export function hasPermission(userRole: UserRole, permission: keyof typeof ROLE_PERMISSIONS[typeof ROLES.SUPERADMIN]): boolean {
  return ROLE_PERMISSIONS[userRole]?.[permission] || false;
}

export function canManageRole(currentUserRole: UserRole, targetRole: UserRole): boolean {
  const currentLevel = ROLE_HIERARCHY[currentUserRole];
  const targetLevel = ROLE_HIERARCHY[targetRole];
  
  // Can only manage roles at or below your level
  return currentLevel >= targetLevel;
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case ROLES.SUPERADMIN:
      return 'Super Admin';
    case ROLES.ADMIN:
      return 'Admin';
    case ROLES.USER:
      return 'User';
    default:
      return 'Unknown';
  }
}

export function getRoleColor(role: UserRole): string {
  switch (role) {
    case ROLES.SUPERADMIN:
      return 'bg-red-100 text-red-800';
    case ROLES.ADMIN:
      return 'bg-blue-100 text-blue-800';
    case ROLES.USER:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
