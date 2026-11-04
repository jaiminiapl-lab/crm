import React from 'react';
import { useCRM } from '../services/CRMContext';
import { PermissionKey } from '../types';

export interface PermissionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission?: PermissionKey;
  anyOf?: PermissionKey[];
  allOf?: PermissionKey[];
  fallback?: React.ReactNode;
}

/**
 * Permission-driven Button component that only renders if the active user
 * has the required RBAC privilege(s). Unauthorized buttons are hidden completely.
 */
export const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
  ...buttonProps
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useCRM();

  let isAuthorized = true;

  if (permission && !hasPermission(permission)) {
    isAuthorized = false;
  }

  if (anyOf && anyOf.length > 0 && !hasAnyPermission(anyOf)) {
    isAuthorized = false;
  }

  if (allOf && allOf.length > 0 && !hasAllPermissions(allOf)) {
    isAuthorized = false;
  }

  if (!isAuthorized) {
    return fallback ? <>{fallback}</> : null;
  }

  return <button {...buttonProps}>{children}</button>;
};
