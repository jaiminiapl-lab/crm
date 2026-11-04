import React from 'react';
import { Users, Flame, FileSpreadsheet, CalendarClock, ArrowUpRight } from 'lucide-react';
import { Lead } from '../../../shared/types';

interface LeadsStatsWidgetProps {
  leads: Lead[];
}

export const LeadsStatsWidget: React.FC<LeadsStatsWidgetProps> = ({ leads }) => {
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => (l.score || 0) >= 80).length;
  const applicationStarted = leads.filter(
    (l) => l.status === 'Application Started' || l.status === 'Documents Pending' || l.status === 'Under Review'
  ).length;
  const highPriority = leads.filter((l) => l.priority === 'High' || l.priority === 'Urgent').length;

  const stats = [
    {
      title: 'Global Applicant Pool',
      value: totalLeads.toLocaleString(),
      change: '+14% vs last cycle',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'High AI Conversion Intent',
      value: hotLeads.toLocaleString(),
      change: `${Math.round((hotLeads / (totalLeads || 1)) * 100)}% of pipeline`,
      icon: Flame,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      title: 'Active Applications',
      value: applicationStarted.toLocaleString(),
      change: '48h avg review time',
      icon: FileSpreadsheet,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'High Priority Attention',
      value: highPriority.toLocaleString(),
      change: 'SLA < 2 hours response',
      icon: CalendarClock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {item.title}
              </span>
              <div className={`p-2 rounded-lg border ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{item.value}</span>
            </div>
            <div className="mt-1 flex items-center text-xs text-slate-500">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 mr-0.5" />
              <span className="text-emerald-600 font-medium">{item.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
