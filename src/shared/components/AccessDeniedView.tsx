import React from 'react';
import { useCRM } from '../services/CRMContext';
import { ShieldAlert, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

interface AccessDeniedViewProps {
  requiredPermission: string;
  pageTitle: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({ requiredPermission, pageTitle }) => {
  const { currentUserRole, setCurrentUserRole, setCurrentPage, roles, addToast } = useCRM();

  const authorizedRoles = roles.filter((r) => r.permissions.includes(requiredPermission as any));

  const handleElevate = (roleId: UserRole) => {
    setCurrentUserRole(roleId);
    addToast({
      title: 'Elevated Access Granted',
      message: `Role switched to "${roleId}". You now have access to ${pageTitle}.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-wider border border-amber-200">
          Authorization Restricted
        </span>

        <h2 className="text-xl font-bold text-slate-900 mt-3">Access Denied for {pageTitle}</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">
          Your current active role (<span className="font-semibold text-slate-800">{currentUserRole}</span>) is not authorized to access this administration module.
        </p>

        <div className="my-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Security Gate:</span>
            <span className="font-mono font-medium text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded">{requiredPermission}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Current Role:</span>
            <span className="font-medium text-amber-700">{currentUserRole}</span>
          </div>
        </div>

        <div className="space-y-2 mb-6 text-left">
          <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            Switch to an authorized role to unlock this screen:
          </p>
          <div className="space-y-1.5">
            {authorizedRoles.map((r) => (
              <button
                key={r.id}
                onClick={() => handleElevate(r.id)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-xs font-medium text-slate-800 transition-colors group"
              >
                <span>Elevate to <span className="font-bold text-blue-700">{r.name}</span></span>
                <span className="text-blue-600 flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-transform">
                  Unlock Module <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
