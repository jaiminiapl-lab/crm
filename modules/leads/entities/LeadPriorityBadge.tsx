import React from 'react';
import { LeadPriority } from '../../../shared/types';

interface LeadPriorityBadgeProps {
  priority: LeadPriority;
}

export const LeadPriorityBadge: React.FC<LeadPriorityBadgeProps> = ({ priority }) => {
  const styles: Record<LeadPriority, string> = {
    Urgent: 'bg-red-50 text-red-700 border-red-200 font-semibold',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  const dots: Record<LeadPriority, string> = {
    Urgent: 'bg-red-600 animate-pulse',
    High: 'bg-rose-500',
    Medium: 'bg-amber-500',
    Low: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md border ${
        styles[priority] || styles.Low
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[priority] || dots.Low}`} />
      {priority}
    </span>
  );
};
