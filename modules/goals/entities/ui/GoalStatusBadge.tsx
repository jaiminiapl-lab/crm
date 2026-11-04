import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, XCircle } from 'lucide-react';
import { GoalStatus } from '../model/types';

interface GoalStatusBadgeProps {
  status: GoalStatus;
  className?: string;
}

export const GoalStatusBadge: React.FC<GoalStatusBadgeProps> = ({ status, className = '' }) => {
  const config = {
    on_track: {
      label: 'On Track',
      icon: CheckCircle2,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    at_risk: {
      label: 'At Risk',
      icon: AlertTriangle,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    exceeded: {
      label: 'Target Exceeded',
      icon: Sparkles,
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    behind: {
      label: 'Behind Schedule',
      icon: XCircle,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  }[status] || {
    label: status,
    icon: CheckCircle2,
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${config.badgeClass} ${className}`}
    >
      <Icon className="w-3 h-3 stroke-[2.5]" />
      <span>{config.label}</span>
    </span>
  );
};
