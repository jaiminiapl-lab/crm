import React from 'react';
import { GoalMetric } from '../../../entities';

interface CreateGoalMetricFieldsProps {
  metric: GoalMetric;
  onMetricChange: (metric: GoalMetric, unit: string) => void;
  targetValue: number;
  onTargetValueChange: (val: number) => void;
}

export const CreateGoalMetricFields: React.FC<CreateGoalMetricFieldsProps> = ({
  metric,
  onMetricChange,
  targetValue,
  onTargetValueChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-slate-700 font-semibold mb-1">Target Metric *</label>
        <select
          value={metric}
          onChange={(e) => {
            const m = e.target.value as GoalMetric;
            let u = 'students';
            if (m === 'revenue') u = '₹';
            else if (m === 'leads') u = 'leads';
            else if (m === 'applications') u = 'applications';
            else if (m === 'counselling_calls') u = 'sessions';
            onMetricChange(m, u);
          }}
          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
        >
          <option value="enrolments">Admissions & Enrolments</option>
          <option value="leads">Lead Generation</option>
          <option value="applications">Application Forms</option>
          <option value="revenue">Tuition Fee Revenue (₹)</option>
          <option value="counselling_calls">Counselling Sessions</option>
        </select>
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">Target Goal Value *</label>
        <input
          type="number"
          required
          min={1}
          value={targetValue}
          onChange={(e) => onTargetValueChange(Number(e.target.value))}
          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
        />
      </div>
    </div>
  );
};
