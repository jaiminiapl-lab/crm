import React from 'react';
import { useCRM } from '../../shared/services';
import { ShieldCheck } from 'lucide-react';
import { getNavGroups } from './sidebarConfig';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    isSidebarCollapsed,
    tasks,
    leads,
    documents,
    applications,
  } = useCRM();

  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const pendingDocs = documents.filter((d) => d.status === 'Pending Review').length;
  const newLeads = leads.filter((l) => l.status === 'New Enquiry' || l.status === 'Contact Pending').length;
  const pendingApps = applications.filter((a) => a.status === 'Under Review' || a.status === 'Submitted').length;

  const navGroups = getNavGroups({ newLeads, pendingTasks, pendingApps, pendingDocs });

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 text-slate-300 transition-all duration-200 border-r border-slate-800 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } lg:static`}
    >
      {/* Brand header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-slate-950/40">
        <div
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm shrink-0">
            IA
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white tracking-tight leading-tight truncate">
                IAPL LMS
              </span>
              <span className="text-[10px] text-blue-400 font-medium tracking-wide uppercase">
                Admissions CRM
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!isSidebarCollapsed && (
              <p className="px-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {!isSidebarCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {!isSidebarCollapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono font-medium ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer info in sidebar */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/20 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Verified ISO 27001
            </span>
            <span className="font-mono text-[10px] text-slate-400">v4.2.0</span>
          </div>
        </div>
      )}
    </aside>
  );
};
