import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

interface LeadScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}

export const LeadScoreBadge: React.FC<LeadScoreBadgeProps> = ({ score, size = 'sm' }) => {
  let color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let Icon = Sparkles;
  let label = 'Hot';

  if (score >= 80) {
    color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = Sparkles;
    label = 'Hot';
  } else if (score >= 60) {
    color = 'bg-blue-50 text-blue-700 border-blue-200';
    Icon = TrendingUp;
    label = 'Warm';
  } else if (score >= 40) {
    color = 'bg-amber-50 text-amber-700 border-amber-200';
    Icon = AlertTriangle;
    label = 'Neutral';
  } else {
    color = 'bg-slate-50 text-slate-600 border-slate-200';
    Icon = AlertTriangle;
    label = 'Cold';
  }

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md border ${color} ${
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
      title={`AI Conversion Score: ${score}/100 (${label})`}
    >
      <Icon className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{score}</span>
      <span className="text-[10px] uppercase font-normal opacity-75 hidden sm:inline">
        {label}
      </span>
    </span>
  );
};
