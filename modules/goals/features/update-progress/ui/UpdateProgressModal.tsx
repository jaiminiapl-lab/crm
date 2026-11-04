import React, { useState } from 'react';
import { X, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Goal, GoalStatus } from '../../../entities';

interface UpdateProgressModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (goalId: string, newValue: number, status: GoalStatus, note?: string) => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  goal,
  isOpen,
  onClose,
  onUpdate,
}) => {
  if (!isOpen || !goal) return null;

  const [value, setValue] = useState<number>(goal.currentValue);
  const [status, setStatus] = useState<GoalStatus>(goal.status);
  const [note, setNote] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(goal.id, Number(value), status, note);
    onClose();
  };

  const percentage = Math.min(Math.round((value / (goal.targetValue || 1)) * 100), 200);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-5 text-xs animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Update Goal Progress</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[280px]">{goal.title}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-3.5">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Target Benchmark</span>
              <span className="text-sm font-bold text-slate-900">{goal.targetValue.toLocaleString()} {goal.unit}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Current Pacing</span>
              <span className="text-sm font-bold text-blue-600 font-mono">{percentage}%</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              New Actual Value ({goal.unit}) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={value}
              onChange={(e) => {
                const val = Number(e.target.value);
                setValue(val);
                if (val >= goal.targetValue) setStatus('exceeded');
                else if (val >= goal.targetValue * 0.7) setStatus('on_track');
                else if (val >= goal.targetValue * 0.4) setStatus('at_risk');
                else setStatus('behind');
              }}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Pacing Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as GoalStatus)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
            >
              <option value="on_track">On Track (Healthy Velocity)</option>
              <option value="at_risk">At Risk (Needs Mid-Week Push)</option>
              <option value="behind">Behind Schedule (Action Required)</option>
              <option value="exceeded">Target Exceeded</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Progress Update Log / Milestone Note</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Conducted 15 follow-up calls today; 4 applicants verified token fees."
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Save Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
