import React, { useState } from 'react';
import { UserCheck, X } from 'lucide-react';
import { Counsellor, LeadStatus } from '../../../shared/types';

interface LeadBulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  counsellors: Counsellor[];
  onBulkAssign: (counsellorId: string) => void;
  onBulkStatusChange: (status: LeadStatus) => void;
  canAssign: boolean;
}

export const LeadBulkActionsBar: React.FC<LeadBulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  counsellors,
  onBulkAssign,
  onBulkStatusChange,
  canAssign,
}) => {
  const [selectedCounsellor, setSelectedCounsellor] = useState('');

  if (selectedCount === 0) return null;

  return (
    <div className="bg-indigo-900 text-white px-4 py-3 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-700 font-bold text-xs">
          {selectedCount}
        </span>
        <span className="text-sm font-medium">
          {selectedCount} applicant{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {canAssign && (
          <div className="flex items-center gap-1.5 bg-indigo-800/80 p-1 rounded-lg border border-indigo-700">
            <UserCheck className="w-4 h-4 text-indigo-300 ml-1.5" />
            <select
              value={selectedCounsellor}
              onChange={(e) => {
                if (e.target.value) {
                  onBulkAssign(e.target.value);
                  setSelectedCounsellor('');
                }
              }}
              className="bg-transparent text-xs text-white font-medium focus:outline-none pr-2 py-1"
            >
              <option value="" className="text-slate-800">Assign to Advisor...</option>
              {counsellors.map((c) => (
                <option key={c.id} value={c.id} className="text-slate-800">
                  {c.name} ({c.assignedLeadsCount} active)
                </option>
              ))}
            </select>
          </div>
        )}

        <select
          onChange={(e) => {
            if (e.target.value) {
              onBulkStatusChange(e.target.value as LeadStatus);
              e.target.value = '';
            }
          }}
          className="bg-indigo-800 text-xs text-white font-medium px-3 py-2 rounded-lg border border-indigo-700 hover:bg-indigo-700 focus:outline-none cursor-pointer"
        >
          <option value="" className="text-slate-800">Change Status...</option>
          <option value="Contacted" className="text-slate-800">Mark Contacted</option>
          <option value="Interested" className="text-slate-800">Mark Interested</option>
          <option value="Counselling Scheduled" className="text-slate-800">Schedule Counselling</option>
          <option value="Application Started" className="text-slate-800">Start Application</option>
        </select>

        <button
          onClick={onClearSelection}
          className="p-1.5 text-indigo-300 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors ml-2"
          title="Deselect all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
