import { PermissionKey, UserRole } from '../types';

export function hasPermission(
  permissions: PermissionKey[],
  requiredPermission: PermissionKey
): boolean {
  return permissions.includes(requiredPermission);
}

export function hasAnyPermission(
  permissions: PermissionKey[],
  requiredPermissions: PermissionKey[]
): boolean {
  return requiredPermissions.some((perm) => permissions.includes(perm));
}

export function hasAllPermissions(
  permissions: PermissionKey[],
  requiredPermissions: PermissionKey[]
): boolean {
  return requiredPermissions.every((perm) => permissions.includes(perm));
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === 'Super Admin';
}
