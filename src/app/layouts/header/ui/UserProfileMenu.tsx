import React, { useState } from 'react';
import { Shield, ChevronDown, Check, User } from 'lucide-react';
import { useCRM, UserRole } from '../../../../shared';

export const UserProfileMenu: React.FC = () => {
  const {
    currentUserRoles,
    toggleCurrentUserRole,
    setCurrentUserRoles,
    effectivePermissions,
    roles,
    setCurrentPage,
  } = useCRM();

  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: 'Super Admin (All Privileges)', roles: ['Super Admin'] },
    { label: 'Dual: Counsellor + CRM Manager', roles: ['Admissions Counsellor', 'CRM Manager'] },
    { label: 'Dual: HR + Operations Manager', roles: ['HR & Talent Manager', 'Campus Operations Manager'] },
    { label: 'Restricted: Counsellor Only (Masked PII)', roles: ['Admissions Counsellor'] },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
          RS
        </div>
        <div className="hidden xl:block text-left text-xs">
          <div className="font-semibold text-slate-800 leading-tight">Dr. Rajeshwari Sen</div>
          <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
            {currentUserRoles.join(' + ')}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-40 space-y-3 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-900">Dr. Rajeshwari Sen</div>
                <div className="text-[10px] text-slate-500">rajeshwari.sen@globaledu.ac</div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {effectivePermissions.length} Rights
              </span>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Active Roles ({currentUserRoles.length})</span>
                <button
                  onClick={() => {
                    setCurrentPage('roles');
                    setIsOpen(false);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 normal-case text-[10px] font-normal"
                >
                  Manage Roles &rarr;
                </button>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {roles.map((r) => {
                  const isActive = currentUserRoles.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleCurrentUserRole(r.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{r.name}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Quick Role Presets
              </div>
              <div className="space-y-1">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentUserRoles(p.roles)}
                    className="w-full text-left text-[11px] text-slate-600 hover:text-indigo-600 hover:bg-slate-50 px-2 py-1 rounded transition-colors truncate"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
