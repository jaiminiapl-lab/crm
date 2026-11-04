import React, { useState, useMemo } from 'react';
import { Target } from 'lucide-react';
import { useCRM } from '../../../shared/services';
import { Goal, GoalCadence, GoalStatus, INITIAL_GOALS } from '../entities';
import { GoalsOverviewWidget } from './ui/GoalsOverviewWidget';
import { WeeklyPacingWidget } from './ui/WeeklyPacingWidget';
import { GoalsListWidget } from './ui/GoalsListWidget';
import { GoalFilterBar, CreateGoalModal, UpdateProgressModal } from '../features';

export const GoalsWidget: React.FC = () => {
  const { addToast } = useCRM();
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [selectedCadence, setSelectedCadence] = useState<'all' | GoalCadence>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<'all' | 'managers' | 'counsellors'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('All Campuses');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGoalForUpdate, setSelectedGoalForUpdate] = useState<Goal | null>(null);

  // Filtered Goals
  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (selectedCadence !== 'all' && g.cadence !== selectedCadence) return false;
      if (assigneeFilter === 'managers' && !g.assignee.isManager) return false;
      if (assigneeFilter === 'counsellors' && g.assignee.isManager) return false;
      if (selectedCampus !== 'All Campuses' && g.campus !== selectedCampus) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = g.title.toLowerCase().includes(query);
        const matchesAssignee = g.assignee.name.toLowerCase().includes(query);
        const matchesRole = g.assignee.role.toLowerCase().includes(query);
        const matchesMetric = g.metric.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAssignee && !matchesRole && !matchesMetric) return false;
      }
      return true;
    });
  }, [goals, selectedCadence, assigneeFilter, selectedCampus, searchQuery]);

  const handleCreateGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `GOL-${Date.now().toString().slice(-4)}`,
    };
    setGoals((prev) => [newGoal, ...prev]);
    addToast({
      title: 'Target Assigned Successfully',
      message: `${newGoal.cadence === 'weekly' ? 'Weekly' : 'Monthly'} goal "${newGoal.title}" assigned to ${newGoal.assignee.name}.`,
      type: 'success',
    });
  };

  const handleUpdateProgress = (goalId: string, newValue: number, newStatus: GoalStatus, note?: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              currentValue: newValue,
              status: newStatus,
              lastUpdated: 'Just now',
              notes: note ? `${note} (Updated ${new Date().toLocaleTimeString()})` : g.notes,
            }
          : g
      )
    );
    addToast({
      title: 'Progress Recorded',
      message: `Goal benchmark progress updated to ${newValue.toLocaleString()}.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Target className="w-6 h-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                Institutional Goals & Targets
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">
                {goals.length} Goals
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly cycles, weekly sprint pacing, and quota assignments for department managers and counsellors.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Overview Widget */}
      <GoalsOverviewWidget goals={goals} />

      {/* Weekly Sprint Pacing Widget */}
      <WeeklyPacingWidget goals={goals} />

      {/* Filter and Action Bar */}
      <GoalFilterBar
        selectedCadence={selectedCadence}
        onCadenceChange={setSelectedCadence}
        assigneeFilter={assigneeFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* Goals Grid List */}
      <GoalsListWidget
        goals={filteredGoals}
        onUpdateClick={(goal: Goal) => setSelectedGoalForUpdate(goal)}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateGoal}
      />

      {/* Update Progress Modal */}
      <UpdateProgressModal
        goal={selectedGoalForUpdate}
        isOpen={!!selectedGoalForUpdate}
        onClose={() => setSelectedGoalForUpdate(null)}
        onUpdate={handleUpdateProgress}
      />
    </div>
  );
};

export { GoalsWidget as GoalsTargetsPage };
export default GoalsWidget;
