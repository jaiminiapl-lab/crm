import React from 'react';
import { Application } from '../../../shared/types';
import { StatusBadge } from '../../../shared/components';

interface LeadApplicationsTabProps {
  applications: Application[];
  onStartApplication: () => void;
  onInspectApplication: () => void;
}

export const LeadApplicationsTab: React.FC<LeadApplicationsTabProps> = ({
  applications,
  onStartApplication,
  onInspectApplication,
}) => {
  if (applications.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-xs">
        <p>No formal admission application submitted yet.</p>
        <button
          onClick={onStartApplication}
          className="mt-3 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg cursor-pointer"
        >
          Generate Application Form
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div
          key={app.id}
          className="p-4 border border-slate-200 rounded-lg flex items-center justify-between gap-4 text-xs"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 font-mono">{app.id}</span>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-slate-700 font-medium mt-1">{app.course}</p>
            <span className="text-[11px] text-slate-400">
              Completeness: {app.completenessPercent}% · Submitted: {app.submissionDate}
            </span>
          </div>

          <button
            onClick={onInspectApplication}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg cursor-pointer"
          >
            Inspect Application
          </button>
        </div>
      ))}
    </div>
  );
};
