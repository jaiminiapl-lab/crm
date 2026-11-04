import React from 'react';
import { GoalMetric } from '../model/types';

interface GoalProgressBarProps {
  current: number;
  target: number;
  unit: string;
  metric: GoalMetric;
  showLabels?: boolean;
  className?: string;
}

export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  current,
  target,
  unit,
  metric,
  showLabels = true,
  className = '',
}) => {
  const percentage = Math.min(Math.round((current / (target || 1)) * 100), 200);

  const formatValue = (val: number) => {
    if (metric === 'revenue') {
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
      return `₹${val.toLocaleString()}`;
    }
    return `${val.toLocaleString()} ${unit}`;
  };

  const getBarColor = () => {
    if (percentage >= 100) return 'bg-indigo-600';
    if (percentage >= 70) return 'bg-emerald-600';
    if (percentage >= 45) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800">
            {formatValue(current)} <span className="font-normal text-slate-400">of {formatValue(target)}</span>
          </span>
          <span className="font-mono font-bold text-slate-700">{percentage}%</span>
        </div>
      )}

      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
