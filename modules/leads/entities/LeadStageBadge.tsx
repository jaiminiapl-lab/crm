import React from 'react';
import { LeadStatus } from '../../../shared/types';

interface LeadStageBadgeProps {
  status: LeadStatus;
}

export const LeadStageBadge: React.FC<LeadStageBadgeProps> = ({ status }) => {
  const styles: Record<LeadStatus, string> = {
    'New Enquiry': 'bg-sky-50 text-sky-700 border-sky-200',
    'Contact Pending': 'bg-amber-50 text-amber-700 border-amber-200',
    Contacted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Interested: 'bg-purple-50 text-purple-700 border-purple-200',
    'Counselling Scheduled': 'bg-teal-50 text-teal-700 border-teal-200',
    'Application Started': 'bg-blue-50 text-blue-700 border-blue-200',
    'Documents Pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'Under Review': 'bg-violet-50 text-violet-700 border-violet-200',
    'Admission Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Payment Pending': 'bg-orange-50 text-orange-700 border-orange-200',
    Enrolled: 'bg-green-50 text-green-700 border-green-200',
    'Lost / Closed': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${
        styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'
      }`}
    >
      {status}
    </span>
  );
};
