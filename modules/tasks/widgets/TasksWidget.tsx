import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader, StatusBadge } from '../../../shared/components';
import { Task, LeadPriority } from '../../../shared/types';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  User,
  AlertTriangle,
  CheckCircle2,
  ListFilter,
  CalendarDays,
  X,
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    setTasks,
    toggleTaskCompletion,
    leads,
    counsellors,
    setSelectedLeadId,
    setCurrentPage,
    addToast,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Overdue' | 'Completed'>('Pending');
  const [taskTypeFilter, setTaskTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newLeadId, setNewLeadId] = useState(leads[0]?.id || '');
  const [newType, setNewType] = useState<Task['type']>('Call');
  const [newDueDate, setNewDueDate] = useState('2026-10-23');
  const [newDueTime, setNewDueTime] = useState('11:00 AM');
  const [newPriority, setNewPriority] = useState<LeadPriority>('High');
  const [newNotes, setNewNotes] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'Pending' && t.status !== 'Pending') return false;
    if (activeTab === 'Overdue' && t.status !== 'Overdue') return false;
    if (activeTab === 'Completed' && t.status !== 'Completed') return false;

    if (taskTypeFilter !== 'All' && t.type !== taskTypeFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;

    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const lead = leads.find((l) => l.id === newLeadId) || leads[0];
    const counsellor = counsellors.find((c) => c.id === lead.assignedCounsellorId) || counsellors[0];

    const newTask: Task = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      leadId: lead.id,
      leadName: lead.name,
      counsellorId: counsellor.id,
      counsellorName: counsellor.name,
      type: newType,
      title: newTitle,
      dueDate: newDueDate,
      dueTime: newDueTime,
      priority: newPriority,
      status: 'Pending',
      notes: newNotes,
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsCreateTaskOpen(false);
    setNewTitle('');
    setNewNotes('');
    addToast({
      title: 'Task Created',
      message: `Follow-up task created for ${lead.name}`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks & Admissions Follow-Ups"
        subtitle="Manage scheduled candidate callbacks, campus visit tours, document verification reminders, and escalations."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Tasks' }]}
        actions={
          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule Task
          </button>
        }
      />

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['Pending', 'Overdue', 'Completed', 'All'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab} (
              {
                tasks.filter((t) =>
                  tab === 'All' ? true : t.status.toLowerCase() === tab.toLowerCase()
                ).length
              }
              )
            </button>
          ))}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={taskTypeFilter}
            onChange={(e) => setTaskTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
          >
            <option value="All">All Channels</option>
            <option value="Call">Phone Call</option>
            <option value="Email">Email</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Campus Visit">Campus Visit</option>
            <option value="Document Review">Document Review</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List Cards */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No tasks found</p>
            <p className="text-xs text-slate-400 mt-0.5">All scheduled tasks for this filter have been completed.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isOverdue = task.status === 'Overdue';

            return (
              <div
                key={task.id}
                className={`p-4 bg-white border rounded-xl shadow-xs flex items-start gap-3.5 transition-all ${
                  isOverdue
                    ? 'border-rose-300 bg-rose-50/20'
                    : isCompleted
                    ? 'border-slate-200 opacity-60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{task.title}</span>
                      <StatusBadge status={task.priority} size="sm" />
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {task.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isOverdue && (
                        <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Escalated Overdue
                        </span>
                      )}
                      <StatusBadge status={task.status} size="sm" />
                    </div>
                  </div>

                  {task.notes && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{task.notes}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Student: </span>
                      <span
                        onClick={() => {
                          setSelectedLeadId(task.leadId);
                          setCurrentPage('lead-details');
                        }}
                        className="font-medium text-blue-600 hover:underline cursor-pointer"
                      >
                        {task.leadName}
                      </span>
                    </div>

                    <span>·</span>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="font-mono text-slate-700">
                        {task.dueDate} at {task.dueTime}
                      </span>
                    </div>

                    <span>·</span>

                    <div className="flex items-center gap-1">
                      <span>Assigned to: </span>
                      <span className="font-medium text-slate-800">{task.counsellorName}</span>
                    </div>

                    {task.completedAt && (
                      <span className="text-emerald-600 font-mono text-[11px] ml-auto">
                        Completed on {task.completedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Task Modal */}
      {isCreateTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Schedule Admissions Task</h3>
              <button
                onClick={() => setIsCreateTaskOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Call student to discuss scholarship & campus hostel"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Target Lead / Student</label>
                  <select
                    value={newLeadId}
                    onChange={(e) => setNewLeadId(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Task Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Task['type'])}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Call">Phone Call</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Campus Visit">Campus Visit</option>
                    <option value="Document Review">Document Review</option>
                    <option value="General">General Follow-Up</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Due Time</label>
                  <input
                    type="text"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    placeholder="11:30 AM"
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as LeadPriority)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Instructions / Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Key talking points or background instructions..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { TasksPage as TasksWidget };
export default TasksPage;
