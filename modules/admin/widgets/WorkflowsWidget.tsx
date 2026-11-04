import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { WorkflowRule } from '../../../shared/types';
import {
  Sliders,
  Plus,
  Play,
  Pause,
  Zap,
  Clock,
  ArrowDown,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  GitCommit,
  Check,
  X,
} from 'lucide-react';

export const WorkflowAutomationPage: React.FC = () => {
  const { workflows, setWorkflows, addToast } = useCRM();

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRule>(workflows[0]);
  const [isTestRunModalOpen, setIsTestRunModalOpen] = useState(false);
  const [isNewWorkflowOpen, setIsNewWorkflowOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newTrigger, setNewTrigger] = useState('New Lead Created');

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const next = w.status === 'Active' ? 'Paused' : 'Active';
          return { ...w, status: next };
        }
        return w;
      })
    );
    addToast({
      title: 'Workflow Toggled',
      message: 'Automation rule active state updated.',
      type: 'info',
    });
  };

  const handleRunTestSimulation = () => {
    setIsTestRunModalOpen(false);
    addToast({
      title: 'Simulation Succeeded',
      message: `Triggered mock execution of "${selectedWorkflow.name}". Verified 0 errors and deduplication check passed.`,
      type: 'success',
    });
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflowName.trim()) return;

    const newWf: WorkflowRule = {
      id: `WF-${Date.now().toString().slice(-3)}`,
      name: newWorkflowName,
      trigger: newTrigger,
      conditions: ['Lead source is verified', 'Candidate consent exists'],
      actions: ['Notify Assigned Team', 'Create Follow-up task in 24h'],
      delay: 'Instant (0s)',
      status: 'Active',
      executionCount: 0,
      lastExecuted: 'Just now',
    };

    setWorkflows((prev) => [newWf, ...prev]);
    setSelectedWorkflow(newWf);
    setIsNewWorkflowOpen(false);
    setNewWorkflowName('');
    addToast({
      title: 'Workflow Configured',
      message: `Workflow "${newWf.name}" created and initialized in sandbox.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflow Automation Builder"
        subtitle="Visual event-driven automation rules connecting lead intake, counselling SLAs, verification triggers, and student provisioning."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Workflow Automation' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTestRunModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Test Execution
            </button>
            <button
              onClick={() => setIsNewWorkflowOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Build New Workflow
            </button>
          </div>
        }
      />

      {/* Grid: Workflow List (1 Col) + Node Visualizer (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Workflow List */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Active Automations</h3>
            <span className="font-mono text-xs text-slate-500">{workflows.length} Rules</span>
          </div>

          <div className="space-y-2.5">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                onClick={() => setSelectedWorkflow(wf)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedWorkflow.id === wf.id
                    ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{wf.name}</span>
                  <StatusBadge status={wf.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  Trigger: {wf.trigger}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                  <span className="font-mono">{wf.executionCount} executions</span>
                  <span>{wf.lastExecuted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual Node Workflow Canvas (2 Cols) */}
        <div className="lg:col-span-2 p-6 bg-slate-50/60 border border-slate-200 rounded-xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 bg-white p-4 rounded-xl shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{selectedWorkflow.name}</h3>
                <StatusBadge status={selectedWorkflow.status} />
              </div>
              <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                Rule ID: {selectedWorkflow.id} · Delay Buffer: {selectedWorkflow.delay}
              </span>
            </div>

            <button
              onClick={() => toggleWorkflowStatus(selectedWorkflow.id)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-colors"
            >
              {selectedWorkflow.status === 'Active' ? 'Pause Rule' : 'Activate Rule'}
            </button>
          </div>

          {/* Visual Node Diagram */}
          <div className="flex flex-col items-center space-y-4 max-w-md mx-auto py-4">
            {/* 1. TRIGGER NODE */}
            <div className="w-full p-4 bg-white border-2 border-blue-500 rounded-xl shadow-xs space-y-1 relative">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                1. Inbound Event Trigger
              </span>
              <p className="text-xs font-semibold text-slate-900">{selectedWorkflow.trigger}</p>
              <span className="text-[11px] text-slate-400 block">Listens to CRM Webhook / Portal API</span>
            </div>

            <ArrowDown className="w-5 h-5 text-slate-400" />

            {/* 2. CONDITION NODE */}
            <div className="w-full p-4 bg-white border border-amber-300 rounded-xl shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                2. Evaluation Filters & Conditions
              </span>
              <ul className="text-xs text-slate-700 space-y-1">
                {selectedWorkflow.conditions.map((cond, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ArrowDown className="w-5 h-5 text-slate-400" />

            {/* 3. DELAY NODE */}
            <div className="px-4 py-1.5 bg-slate-200 text-slate-700 font-mono text-xs rounded-full flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Delay Buffer: {selectedWorkflow.delay}</span>
            </div>

            <ArrowDown className="w-5 h-5 text-slate-400" />

            {/* 4. ACTIONS NODE */}
            <div className="w-full p-4 bg-white border-2 border-emerald-500 rounded-xl shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                3. Automated Dispatch Actions
              </span>
              <ul className="text-xs text-slate-700 space-y-1.5">
                {selectedWorkflow.actions.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Test Simulation Modal */}
      {isTestRunModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">
              Run Dry-Run Workflow Simulation
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Simulate rule triggers without dispatching actual WhatsApp messages or charging SMS gateway credits.
            </p>

            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Rule:</span>
                <span className="font-semibold text-slate-800">{selectedWorkflow.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Test Candidate:</span>
                <span className="font-mono text-slate-800">LEAD-1049 (Aditya Deshmukh)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deduplication Guard:</span>
                <span className="text-emerald-700 font-semibold">Active (Passed)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setIsTestRunModalOpen(false)}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunTestSimulation}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Execute Dry Run
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Workflow Modal */}
      {isNewWorkflowOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">New Automated Workflow Rule</h3>
            <form onSubmit={handleCreateWorkflow} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Workflow Name *</label>
                <input
                  type="text"
                  required
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="e.g. Scholarship Auto-Approval Alert"
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Primary Event Trigger</label>
                <select
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="New Lead Created">New Lead Created</option>
                  <option value="Application Completeness Reaches 100%">Application Completeness Reaches 100%</option>
                  <option value="Documents Approved by Reviewer">Documents Approved by Reviewer</option>
                  <option value="Token Fee Paid via Gateway">Token Fee Paid via Gateway</option>
                  <option value="Follow-Up Task Overdue past 4 Hours">Follow-Up Task Overdue past 4 Hours</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewWorkflowOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Save & Initialize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { WorkflowAutomationPage as WorkflowsWidget };
export default WorkflowAutomationPage;
