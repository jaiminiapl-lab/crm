import React from 'react';
import { Search, X } from 'lucide-react';
import { Course, LeadStatus } from '../../../shared/types';
import { INTERNATIONAL_CAMPUSES } from '../../../shared/constants';

export interface LeadFilterState {
  search: string;
  status: string;
  course: string;
  campus: string;
  scoreTier: string;
}

interface LeadFilterBarProps {
  filters: LeadFilterState;
  onFilterChange: (filters: LeadFilterState) => void;
  onReset: () => void;
  courses: Course[];
  activeCount: number;
}

const STATUS_OPTIONS: (LeadStatus | 'ALL')[] = [
  'ALL',
  'New Enquiry',
  'Contact Pending',
  'Contacted',
  'Interested',
  'Counselling Scheduled',
  'Application Started',
  'Documents Pending',
  'Under Review',
  'Admission Approved',
  'Payment Pending',
  'Enrolled',
  'Lost / Closed',
];

export const LeadFilterBar: React.FC<LeadFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  courses,
}) => {
  const hasActiveFilters =
    filters.search ||
    filters.status !== 'ALL' ||
    filters.course !== 'ALL' ||
    filters.campus !== 'ALL' ||
    filters.scoreTier !== 'ALL';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates by name, email, phone or student ID..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Stages ({STATUS_OPTIONS.length - 1})</option>
            {STATUS_OPTIONS.filter((s) => s !== 'ALL').map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filters.campus}
            onChange={(e) => onFilterChange({ ...filters, campus: e.target.value })}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Global Hubs</option>
            {INTERNATIONAL_CAMPUSES.filter((c: string) => c !== 'All Campuses').map((campus: string) => (
              <option key={campus} value={campus}>{campus}</option>
            ))}
          </select>

          <select
            value={filters.course}
            onChange={(e) => onFilterChange({ ...filters, course: e.target.value })}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Academic Programs</option>
            {courses.map((course) => (
              <option key={course.id} value={course.name}>{course.name}</option>
            ))}
          </select>

          <select
            value={filters.scoreTier}
            onChange={(e) => onFilterChange({ ...filters, scoreTier: e.target.value })}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All AI Tiers</option>
            <option value="HOT">🔥 Hot (Score 80-100)</option>
            <option value="WARM">⚡ Warm (Score 60-79)</option>
            <option value="NEUTRAL">📊 Neutral (Score 40-59)</option>
            <option value="COLD">❄️ Cold (Score &lt; 40)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
