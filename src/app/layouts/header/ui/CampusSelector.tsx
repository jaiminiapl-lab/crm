import React from 'react';
import { Building2, Calendar } from 'lucide-react';
import { useCRM } from '../../../../shared/services';
import { INTERNATIONAL_CAMPUSES } from '../../../../shared/constants';

export const CampusSelector: React.FC = () => {
  const { selectedCampus, setSelectedCampus, selectedDateRange, setSelectedDateRange } = useCRM();

  const dateRanges = [
    'Academic Year 2026-27',
    'This Quarter (Q3 2026)',
    'This Month (Oct 2026)',
    'This Week',
  ];

  return (
    <div className="hidden lg:flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <select
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
          className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
        >
          {INTERNATIONAL_CAMPUSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <select
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value)}
          className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
        >
          {dateRanges.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
