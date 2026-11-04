import React from 'react';
import { Calendar, Crown, Building2, TrendingUp, Edit3 } from 'lucide-react';
import { Goal, GoalMetricBadge, GoalStatusBadge, GoalProgressBar, WeeklyMilestone } from '../../entities';

interface GoalCardProps {
  goal: Goal;
  onUpdateClick: (goal: Goal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdateClick }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-4 flex flex-col justify-between space-y-3.5">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                goal.cadence === 'weekly'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {goal.cadence} Sprint
            </span>
            <GoalMetricBadge metric={goal.metric} />
          </div>
          <GoalStatusBadge status={goal.status} />
        </div>

        {/* Goal Title */}
        <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">{goal.title}</h4>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" /> {goal.periodLabel}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" /> {goal.campus}
          </span>
        </div>
      </div>

      {/* Progress Bar Section */}
      <GoalProgressBar
        current={goal.currentValue}
        target={goal.targetValue}
        unit={goal.unit}
        metric={goal.metric}
      />

      {/* Milestones Mini Indicators if present */}
      {goal.milestones && goal.milestones.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-medium">Sprint Milestones:</span>
          <div className="flex items-center gap-1.5">
            {goal.milestones.map((m: WeeklyMilestone) => (
              <span
                key={m.weekNumber}
                title={`${m.weekLabel}: ${m.actual}/${m.target} (Status: ${m.status})`}
                className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[9px] ${
                  m.status === 'exceeded'
                    ? 'bg-indigo-100 text-indigo-700'
                    : m.status === 'on_track'
                    ? 'bg-emerald-100 text-emerald-700'
                    : m.actual > 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                W{m.weekNumber}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Assignee & Action Footer */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {goal.assignee.avatarText}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-900 truncate">
                {goal.assignee.name}
              </span>
              {goal.assignee.isManager && (
                <span title="Department Manager" className="text-amber-500">
                  <Crown className="w-3 h-3" />
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block truncate">
              {goal.assignee.role}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onUpdateClick(goal)}
          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 shrink-0"
        >
          <Edit3 className="w-3 h-3" />
          Update
        </button>
      </div>
    </div>
  );
};
