import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import {
  UserCheck,
  Zap,
  Users,
  Settings,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  RefreshCw,
  Building,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const SmartAssignmentPage: React.FC = () => {
  const { leads, counsellors, assignLead, addToast } = useCRM();

  // Unassigned leads
  const unassignedLeads = leads.filter(
    (l) => !l.assignedCounsellorId || l.status === 'New Enquiry'
  );

  const [assignmentMode, setAssignmentMode] = useState<'round-robin' | 'workload-balanced' | 'course-specialist'>('round-robin');
  const [selectedLeadIdToAssign, setSelectedLeadIdToAssign] = useState<string>('');
  const [selectedTargetCounsellor, setSelectedTargetCounsellor] = useState<string>('');

  const [activeRules, setActiveRules] = useState([
    {
      id: 'rule-1',
      name: 'B.Tech AI Specialized Assignment',
      condition: 'Course is B.Tech in Computer Science & AI',
      strategy: 'Round-Robin between Mumbai & Bengaluru Tech Counsellors',
      active: true,
      appliedCount: 412,
    },
    {
      id: 'rule-2',
      name: 'MBA & Executive Lead Routing',
      condition: 'Course is MBA or M.Sc and CAT/GMAT score present',
      strategy: 'Assign to Senior Counsellors with Capacity < 80%',
      active: true,
      appliedCount: 189,
    },
    {
      id: 'rule-3',
      name: 'Campus Locality Geo-Targeting',
      condition: 'Candidate State matches Campus State',
      strategy: 'Route to nearest regional campus team',
      active: true,
      appliedCount: 520,
    },
  ]);

  const handleManualAssign = () => {
    if (!selectedLeadIdToAssign || !selectedTargetCounsellor) return;
    assignLead(selectedLeadIdToAssign, selectedTargetCounsellor);
    setSelectedLeadIdToAssign('');
    setSelectedTargetCounsellor('');
  };

  const handleRunAutoDistribution = () => {
    let count = 0;
    unassignedLeads.forEach((lead, idx) => {
      // Pick counsellor based on least load
      const availableCounsellor = [...counsellors].sort(
        (a, b) => a.assignedLeadsCount / a.maxCapacity - b.assignedLeadsCount / b.maxCapacity
      )[idx % counsellors.length];

      assignLead(lead.id, availableCounsellor.id);
      count++;
    });

    addToast({
      title: 'Auto-Assignment Complete',
      message: `Distributed ${count} unassigned leads across active counsellors.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Lead Assignment Engine"
        subtitle="Automated round-robin distribution, capacity-aware routing, and unassigned inquiry queue management."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Smart Assignment' }]}
        actions={
          <button
            onClick={handleRunAutoDistribution}
            disabled={unassignedLeads.length === 0}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" /> Run Auto-Distribution ({unassignedLeads.length})
          </button>
        }
      />

      {/* Top Warning Banner if unassigned leads exist */}
      {unassignedLeads.length > 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{unassignedLeads.length} inbound inquiries</strong> require assignment or initial counsellor contact. Target response SLA is &lt; 30 mins.
            </span>
          </div>
          <span className="font-mono text-amber-700 font-semibold text-[11px]">SLA At Risk</span>
        </div>
      )}

      {/* Grid: Unassigned Queue + Counsellor Capacity Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unassigned Leads Queue (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Pending Assignment Queue</h3>
              <p className="text-xs text-slate-500">New inquiries awaiting dedicated counsellor assignment</p>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-700">
              {unassignedLeads.length} In Queue
            </span>
          </div>

          {unassignedLeads.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Queue is Clear</p>
              <p className="text-[11px] mt-0.5">All new student enquiries have been assigned to counsellors.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
              {unassignedLeads.map((l) => (
                <div key={l.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{l.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{l.id}</span>
                      <StatusBadge status={l.priority} size="sm" />
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{l.interestedCourse}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span>Source: {l.source}</span>
                      <span>·</span>
                      <span>City: {l.city}</span>
                      <span>·</span>
                      <span>Pref: {l.preferredCampus}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      onChange={(e) => assignLead(l.id, e.target.value)}
                      defaultValue=""
                      className="text-xs px-2 py-1 border border-slate-200 rounded-md bg-slate-50 text-slate-700"
                    >
                      <option value="" disabled>
                        Assign To...
                      </option>
                      {counsellors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.assignedLeadsCount}/{c.maxCapacity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Counsellor Capacity Indicators (1 Col) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Counsellor Capacity Meters</h3>
              <p className="text-xs text-slate-500">Live active workload vs quota</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {counsellors.map((c) => {
              const utilPercent = Math.round((c.assignedLeadsCount / c.maxCapacity) * 100);
              const isOverloaded = utilPercent >= 85;

              return (
                <div key={c.id} className="text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">{c.name}</span>
                      <span className="text-[10px] text-slate-400 block">{c.campus}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-slate-900">
                        {c.assignedLeadsCount} / {c.maxCapacity}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1">({utilPercent}%)</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverloaded ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(utilPercent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assignment Rules Configuration */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Automated Routing Rules</h3>
            <p className="text-xs text-slate-500">Active rules determining lead distribution when inquiries arrive</p>
          </div>
          <button
            onClick={() =>
              addToast({
                title: 'Rule Builder',
                message: 'Custom rule wizard opened.',
                type: 'info',
              })
            }
            className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Create New Rule
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeRules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{rule.name}</span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-800 rounded">
                  Active
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                <strong>If:</strong> {rule.condition}
              </p>
              <p className="text-slate-600 text-[11px]">
                <strong>Then:</strong> {rule.strategy}
              </p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>Applied {rule.appliedCount} times</span>
                <span className="text-blue-600 cursor-pointer hover:underline">Edit logic</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { SmartAssignmentPage as AssignmentWidget };
export default SmartAssignmentPage;
