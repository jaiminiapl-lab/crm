import React from 'react';
import { Task } from '../../../shared/types';
import { StatusBadge } from '../../../shared/components';

interface DashboardPriorityFollowUpsProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onSelectLead: (leadId: string) => void;
  onViewAllTasks: () => void;
}

export const DashboardPriorityFollowUps: React.FC<DashboardPriorityFollowUpsProps> = ({
  tasks,
  onToggleTask,
  onSelectLead,
  onViewAllTasks,
}) => {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Priority Follow-Ups</h3>
          <p className="text-xs text-slate-500">Urgent tasks due today</p>
        </div>
        <button
          onClick={onViewAllTasks}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          All Tasks
        </button>
      </div>

      <div className="mt-3 divide-y divide-slate-100 space-y-2">
        {tasks.slice(0, 4).map((task) => (
          <div key={task.id} className="pt-2 flex items-start gap-2.5 text-xs">
            <input
              type="checkbox"
              checked={task.status === 'Completed'}
              onChange={() => onToggleTask(task.id)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span
                  onClick={() => onSelectLead(task.leadId)}
                  className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer truncate"
                >
                  {task.leadName}
                </span>
                <StatusBadge status={task.priority} size="sm" />
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5 truncate">{task.title}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                <span className="font-mono">{task.dueTime}</span>
                <span>·</span>
                <span>{task.counsellorName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
