import React from 'react';
import { Users, FileText, GraduationCap, IndianRupee, PhoneCall } from 'lucide-react';
import { GoalMetric } from '../model/types';

interface GoalMetricBadgeProps {
  metric: GoalMetric;
  className?: string;
}

export const GoalMetricBadge: React.FC<GoalMetricBadgeProps> = ({ metric, className = '' }) => {
  const config = {
    leads: {
      label: 'Lead Generation',
      icon: Users,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    applications: {
      label: 'Applications',
      icon: FileText,
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    enrolments: {
      label: 'Admissions & Enrolments',
      icon: GraduationCap,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    revenue: {
      label: 'Fee Revenue Collection',
      icon: IndianRupee,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    counselling_calls: {
      label: 'Counselling Sessions',
      icon: PhoneCall,
      badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  }[metric] || {
    label: metric,
    icon: Users,
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${config.badgeClass} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
