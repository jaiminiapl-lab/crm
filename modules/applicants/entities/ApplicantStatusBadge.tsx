import React from 'react';

interface ApplicantStatusBadgeProps {
  status: string;
}

export const ApplicantStatusBadge: React.FC<ApplicantStatusBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    'Under Review': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Shortlisted: 'bg-teal-50 text-teal-700 border-teal-200',
    Waitlisted: 'bg-amber-50 text-amber-700 border-amber-200',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    Draft: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${
        styles[status] || styles.Draft
      }`}
    >
      {status}
    </span>
  );
};
