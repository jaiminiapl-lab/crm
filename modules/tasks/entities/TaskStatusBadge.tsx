import React from 'react';

interface TaskStatusBadgeProps {
  status: 'Pending' | 'Completed' | 'Overdue';
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
};
