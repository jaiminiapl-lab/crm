import React from 'react';
import { Calendar, Flame, CheckCircle2, AlertCircle } from 'lucide-react';
import { Goal, WeeklyMilestone } from '../../entities';

interface WeeklyPacingWidgetProps {
  goals: Goal[];
}

export const WeeklyPacingWidget: React.FC<WeeklyPacingWidgetProps> = ({ goals }) => {
  // Aggregate weekly milestones from monthly goals
  const monthlyGoals = goals.filter((g) => g.cadence === 'monthly' && g.milestones && g.milestones.length > 0);

  const weeks = [1, 2, 3, 4].map((wk) => {
    let targetSum = 0;
    let actualSum = 0;
    monthlyGoals.forEach((g) => {
      const ms = g.milestones?.find((m: WeeklyMilestone) => m.weekNumber === wk);
      if (ms) {
        targetSum += ms.target;
        actualSum += ms.actual;
      }
    });

    const isCurrentWeek = wk === 2; // e.g. currently in Week 2
    const isCompleted = wk < 2;
    const isFuture = wk > 2;

    return {
      weekNumber: wk,
      label: `Week ${wk}`,
      targetSum,
      actualSum,
      pct: targetSum > 0 ? Math.min(Math.round((actualSum / targetSum) * 100), 100) : 0,
      isCurrentWeek,
      isCompleted,
      isFuture,
    };
  });

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <Flame className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Weekly Pacing & Sprint Cadence</h3>
            <p className="text-[11px] text-slate-500">
              Week-by-week burn-up of admissions and revenue milestones for November 2026
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
          Current Sprint: Week 2
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {weeks.map((w) => (
          <div
            key={w.weekNumber}
            className={`p-3 rounded-lg border transition-all ${
              w.isCurrentWeek
                ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/10'
                : 'bg-slate-50/60 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">{w.label}</span>
              {w.isCompleted ? (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Met
                </span>
              ) : w.isCurrentWeek ? (
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded animate-pulse">
                  Active
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Upcoming</span>
              )}
            </div>

            <div className="mt-2.5 flex items-baseline justify-between text-xs">
              <span className="text-[11px] text-slate-500">Pacing Progress:</span>
              <span className="font-bold text-slate-800 font-mono">
                {w.isFuture ? '--' : `${w.pct}%`}
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  w.isCompleted ? 'bg-emerald-600' : w.isCurrentWeek ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                style={{ width: `${w.isFuture ? 0 : w.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
