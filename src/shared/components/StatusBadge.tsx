import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant, size = 'sm' }) => {
  // Infer variant if not explicitly provided
  let computedVariant = variant;
  if (!computedVariant) {
    const s = status.toLowerCase();
    if (
      s.includes('approved') ||
      s.includes('verified') ||
      s.includes('enrolled') ||
      s.includes('completed') ||
      s.includes('hot') ||
      s.includes('paid in full') ||
      s.includes('active')
    ) {
      computedVariant = 'success';
    } else if (
      s.includes('urgent') ||
      s.includes('overdue') ||
      s.includes('rejected') ||
      s.includes('lost') ||
      s.includes('failed') ||
      s.includes('action required')
    ) {
      computedVariant = 'danger';
    } else if (
      s.includes('pending') ||
      s.includes('review') ||
      s.includes('warm') ||
      s.includes('partial') ||
      s.includes('scheduled') ||
      s.includes('waitlist')
    ) {
      computedVariant = 'warning';
    } else if (
      s.includes('interested') ||
      s.includes('contacted') ||
      s.includes('application started') ||
      s.includes('shortlisted')
    ) {
      computedVariant = 'info';
    } else {
      computedVariant = 'neutral';
    }
  }

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-blue-50 text-blue-700 border-blue-200/80',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200/80',
    default: 'bg-slate-50 text-slate-700 border-slate-200/80',
  }[computedVariant || 'neutral'];

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${variantStyles} ${sizeStyles} whitespace-nowrap`}
    >
      {status}
    </span>
  );
};
