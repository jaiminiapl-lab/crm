import React from 'react';
import { Search, Plus, Filter, Calendar, Users } from 'lucide-react';
import { GoalCadence } from '../../../entities';

interface GoalFilterBarProps {
  selectedCadence: 'all' | GoalCadence;
  onCadenceChange: (cadence: 'all' | GoalCadence) => void;
  assigneeFilter: 'all' | 'managers' | 'counsellors';
  onAssigneeFilterChange: (type: 'all' | 'managers' | 'counsellors') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCampus: string;
  onCampusChange: (campus: string) => void;
  onOpenCreateModal: () => void;
}

export const GoalFilterBar: React.FC<GoalFilterBarProps> = ({
  selectedCadence,
  onCadenceChange,
  assigneeFilter,
  onAssigneeFilterChange,
  searchQuery,
  onSearchChange,
  selectedCampus,
  onCampusChange,
  onOpenCreateModal,
}) => {
  const campuses = [
    'All Campuses',
    'Mumbai Main Campus',
    'Bengaluru Tech Campus',
    'Delhi NCR Campus',
    'Pune Innovation Hub',
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search goals by title, manager name, or metric..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Assign New Goal / Target
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Cadence Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
          {(['all', 'monthly', 'weekly'] as const).map((cadence) => (
            <button
              key={cadence}
              type="button"
              onClick={() => onCadenceChange(cadence)}
              className={`px-3 py-1 rounded-md font-semibold transition-all capitalize ${
                selectedCadence === cadence
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cadence === 'all' ? 'All Goals' : `${cadence} Goals`}
            </button>
          ))}
        </div>

        {/* Assignee Filter: All / Managers / Counsellors */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Assignee:
          </span>
          <select
            value={assigneeFilter}
            onChange={(e) => onAssigneeFilterChange(e.target.value as any)}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 text-xs font-medium focus:outline-hidden focus:border-blue-500"
          >
            <option value="all">All Assignees</option>
            <option value="managers">Assigned to Managers</option>
            <option value="counsellors">Assigned to Counsellors</option>
          </select>

          {/* Campus Filter */}
          <select
            value={selectedCampus}
            onChange={(e) => onCampusChange(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 text-xs font-medium focus:outline-hidden focus:border-blue-500"
          >
            {campuses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
