import React from 'react';
import { Target, Plus } from 'lucide-react';
import { Goal } from '../../entities';
import { GoalCard } from './GoalCard';

interface GoalsListWidgetProps {
  goals: Goal[];
  onUpdateClick: (goal: Goal) => void;
  onOpenCreateModal: () => void;
}

export const GoalsListWidget: React.FC<GoalsListWidgetProps> = ({
  goals,
  onUpdateClick,
  onOpenCreateModal,
}) => {
  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Target className="w-6 h-6" />
        </div>
        <div className="max-w-sm mx-auto">
          <h4 className="text-sm font-bold text-slate-900">No Goals Found</h4>
          <p className="text-xs text-slate-500 mt-1">
            No institutional targets match the current filters. Adjust search or assign a new target.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Assign Target Now
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onUpdateClick={onUpdateClick} />
      ))}
    </div>
  );
};
