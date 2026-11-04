import React from 'react';
import { Task } from '../../../shared/types';
import { StatusBadge } from '../../../shared/components';

interface LeadTasksTabProps {
  tasks: Task[];
  onCreateTask: () => void;
}

export const LeadTasksTab: React.FC<LeadTasksTabProps> = ({ tasks, onCreateTask }) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Follow-Up Tasks for this Student
        </h4>
        <button
          onClick={onCreateTask}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          Create Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-xs text-slate-500 py-4">No pending follow-ups currently scheduled.</p>
      ) : (
        tasks.map((t) => (
          <div
            key={t.id}
            className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3 text-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{t.title}</span>
                <StatusBadge status={t.priority} />
              </div>
              <p className="text-slate-600 text-[11px] mt-1">{t.notes}</p>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Due: {t.dueDate} at {t.dueTime}
              </span>
            </div>
            <StatusBadge status={t.status} />
          </div>
        ))
      )}
    </div>
  );
};
