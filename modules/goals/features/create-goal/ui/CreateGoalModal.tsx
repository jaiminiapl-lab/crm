import React, { useState } from 'react';
import { X, Target, Plus } from 'lucide-react';
import { Goal, GoalCadence, GoalMetric } from '../../../entities';
import { CreateGoalAssigneeFields } from './CreateGoalAssigneeFields';
import { CreateGoalMetricFields } from './CreateGoalMetricFields';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: Omit<Goal, 'id' | 'createdAt'>) => void;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    cadence: 'monthly' as GoalCadence,
    periodLabel: 'November 2026',
    metric: 'enrolments' as GoalMetric,
    targetValue: 30,
    unit: 'students',
    assigneeName: 'Rohan Mehra',
    isManager: true,
    campus: 'Mumbai Main Campus',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.targetValue) return;
    const { title, cadence, periodLabel, metric, targetValue, unit, assigneeName, isManager, campus, notes } = form;
    onSubmit({
      title: title.trim(), cadence, periodLabel, metric, targetValue: Number(targetValue),
      currentValue: 0, unit, status: 'on_track',
      assignee: {
        id: `usr-${Date.now()}`, name: assigneeName,
        role: isManager ? 'Admissions Operations Manager' : 'Admissions Counsellor',
        department: 'Admissions & Administration',
        avatarText: assigneeName.split(' ').map((n) => n[0]).join('').slice(0, 2),
        isManager,
      },
      assignedBy: 'Dr. Rajeshwari Sen (Super Admin)', campus, department: 'Admissions & Administration',
      startDate: new Date().toISOString().split('T')[0], endDate: '2026-11-30', notes, lastUpdated: 'Just now',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 text-xs animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700"><Target className="w-4 h-4" /></span>
            <h3 className="text-base font-bold text-slate-900">Assign Institutional Goal / Target</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Goal Title *</label>
            <input
              type="text" required value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. November UG Enrolments Target - Mumbai"
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Cadence / Sprint *</label>
              <select
                value={form.cadence}
                onChange={(e) => {
                  const val = e.target.value as GoalCadence;
                  setForm((p) => ({ ...p, cadence: val, periodLabel: val === 'weekly' ? 'Week 45 (Nov 10-16)' : 'November 2026' }));
                }}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="weekly">Weekly Target (7 Days Sprint)</option>
                <option value="monthly">Monthly Target (30 Days Cycle)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Period Label</label>
              <input
                type="text" value={form.periodLabel}
                onChange={(e) => setForm((p) => ({ ...p, periodLabel: e.target.value }))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <CreateGoalMetricFields
            metric={form.metric}
            onMetricChange={(metric, unit) => setForm((p) => ({ ...p, metric, unit }))}
            targetValue={form.targetValue}
            onTargetValueChange={(targetValue) => setForm((p) => ({ ...p, targetValue }))}
          />

          <CreateGoalAssigneeFields
            assigneeName={form.assigneeName}
            onAssigneeNameChange={(assigneeName, isManager) => setForm((p) => ({ ...p, assigneeName, isManager }))}
            campus={form.campus}
            onCampusChange={(campus) => setForm((p) => ({ ...p, campus }))}
          />

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Operational Instructions & Notes</label>
            <textarea
              rows={2} value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="e.g. Focus on B.Tech in AI scholarship eligibility candidates..."
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4 stroke-[2.5]" /> Confirm & Assign Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
