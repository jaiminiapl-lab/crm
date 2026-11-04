import React, { useState } from 'react';
import { useCRM } from '../services/CRMContext';
import { PermissionKey, UserRole } from '../types';
import { Lock, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

interface PermissionGuardProps {
  permission: PermissionKey;
  children: React.ReactNode;
  fallback?: 'hide' | 'disable' | 'dialog';
  tooltip?: string;
  className?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = 'disable',
  tooltip,
  className = '',
}) => {
  const { hasPermission, currentUserRole, setCurrentUserRole, roles, addToast } = useCRM();
  const [showModal, setShowModal] = useState(false);

  const allowed = hasPermission(permission);

  if (allowed) {
    return <>{children}</>;
  }

  if (fallback === 'hide') {
    return null;
  }

  // Find which roles have this permission
  const rolesWithAccess = roles.filter((r) => r.permissions.includes(permission));

  const handleRestrictedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const handleSwitchToElevatedRole = (roleId: UserRole) => {
    setCurrentUserRole(roleId);
    setShowModal(false);
    addToast({
      title: 'Role Elevated',
      message: `Temporarily switched to "${roleId}" with elevated access.`,
      type: 'success',
    });
  };

  return (
    <>
      <div
        className={`relative inline-flex items-center group cursor-not-allowed ${className}`}
        onClick={handleRestrictedClick}
        title={tooltip || `Restricted: Requires permission "${permission}"`}
      >
        <div className="opacity-50 pointer-events-none select-none filter grayscale">
          {children}
        </div>
        <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-xs">
          <Lock className="w-2.5 h-2.5" />
        </span>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-left animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Access Restricted</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your current active role ({currentUserRole}) lacks required administrative privileges.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Required Permission:</span>
                <span className="font-mono font-medium text-slate-800 bg-slate-200/70 px-1.5 py-0.5 rounded">
                  {permission}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Role:</span>
                <span className="font-medium text-amber-700">{currentUserRole}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-slate-700 mb-2">
                Roles authorized for this action:
              </p>
              <div className="space-y-1.5">
                {rolesWithAccess.length > 0 ? (
                  rolesWithAccess.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSwitchToElevatedRole(r.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-slate-700 font-medium group"
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Switch to {r.name}</span>
                      </div>
                      <span className="text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                        Elevate <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No active role currently holds this permission. Please enable it in the Roles & Permissions Matrix.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
