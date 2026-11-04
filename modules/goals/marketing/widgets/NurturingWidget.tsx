import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { NurturingSequence } from '../../../shared/types';
import {
  GitBranch,
  Plus,
  Play,
  Pause,
  Mail,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle,
  Users,
  AlertCircle,
  X,
} from 'lucide-react';

export const LeadNurturingPage: React.FC = () => {
  const { sequences, setSequences, addToast } = useCRM();

  const [selectedSeq, setSelectedSeq] = useState<NurturingSequence>(sequences[0]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [seqName, setSeqName] = useState('');
  const [targetSegment, setTargetSegment] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('Brochure Download');

  const toggleSequenceStatus = (seqId: string) => {
    setSequences((prev) =>
      prev.map((s) => {
        if (s.id === seqId) {
          const nextStatus = s.status === 'Active' ? 'Paused' : 'Active';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
    addToast({
      title: 'Sequence Updated',
      message: 'Lead drip sequence execution state toggled.',
      type: 'info',
    });
  };

  const handleCreateSequence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seqName.trim()) return;

    const newSeq: NurturingSequence = {
      id: `SEQ-${Date.now().toString().slice(-3)}`,
      name: seqName,
      targetSegment: targetSegment || 'All Inbound Leads',
      triggerEvent,
      status: 'Active',
      totalEnrolled: 0,
      completedCount: 0,
      avgEngagementRate: 0,
      stepsCount: 3,
    };

    setSequences((prev) => [...prev, newSeq]);
    setSelectedSeq(newSeq);
    setIsCreateOpen(false);
    setSeqName('');
    setTargetSegment('');
    addToast({
      title: 'Nurture Sequence Activated',
      message: `Created automated sequence "${newSeq.name}"`,
      type: 'success',
    });
  };

  // Steps in the selected sequence
  const sequenceSteps = [
    {
      step: 1,
      delay: 'Immediate (0 min)',
      channel: 'WhatsApp & SMS',
      title: 'Curriculum & Program Brochure Dispatch',
      content: 'Welcome! Here is your requested academic curriculum PDF and fee structure handbook.',
    },
    {
      step: 2,
      delay: 'Day 2 (+48 hours)',
      channel: 'Email',
      title: 'Campus Labs & Faculty Highlights',
      content: 'Meet our distinguished faculty and explore our NVIDIA AI cluster and Fintech research centers.',
    },
    {
      step: 3,
      delay: 'Day 5 (+120 hours)',
      channel: 'WhatsApp',
      title: '1-on-1 Academic Consultation Invitation',
      content: 'Exclusive invite to connect with a Senior Admissions Counsellor for merit scholarship eligibility.',
    },
    {
      step: 4,
      delay: 'Day 7 (+168 hours)',
      channel: 'Email',
      title: 'Early Decision Application Deadline Alert',
      content: 'Reminder that Round 1 scholarship seats close this Sunday. Complete your application draft today.',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Lead Nurturing & Drip Sequences"
        subtitle="Automated, consent-respecting multi-touch nurture tracks that halt immediately upon student enrolment."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Smart Lead Nurturing' }]}
        actions={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Create Drip Sequence
          </button>
        }
      />

      {/* Compliance banner */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Consent & Frequency Guardrails:</strong> Automatic opt-out adherence, maximum 1 touchpoint per 48 hours, and immediate sequence termination once student completes fee deposit.
          </span>
        </div>
      </div>

      {/* Grid: Sequences List (1 Col) + Step Workflow Inspection (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sequences Roster */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Active Sequences</h3>
            <span className="font-mono text-xs text-slate-500">{sequences.length} Sequences</span>
          </div>

          <div className="space-y-2.5">
            {sequences.map((seq) => (
              <div
                key={seq.id}
                onClick={() => setSelectedSeq(seq)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedSeq.id === seq.id
                    ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{seq.name}</span>
                  <StatusBadge status={seq.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{seq.targetSegment}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                  <span className="font-mono">{seq.totalEnrolled} In Track</span>
                  <span className="font-semibold text-emerald-700 font-mono">
                    {seq.avgEngagementRate}% Open Rate
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Sequence Steps & Timing Details */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{selectedSeq.name}</h3>
                <StatusBadge status={selectedSeq.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target: {selectedSeq.targetSegment} · Trigger: {selectedSeq.triggerEvent}
              </p>
            </div>

            <button
              onClick={() => toggleSequenceStatus(selectedSeq.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                selectedSeq.status === 'Active'
                  ? 'border-amber-300 text-amber-800 hover:bg-amber-50'
                  : 'border-emerald-300 text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {selectedSeq.status === 'Active' ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Sequence
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Activate Sequence
                </>
              )}
            </button>
          </div>

          {/* Drip Step Pipeline */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Automated Cadence Steps
            </span>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {sequenceSteps.slice(0, selectedSeq.stepsCount || 3).map((st) => (
                <div
                  key={st.step}
                  className="relative p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs"
                >
                  <div className="absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white bg-blue-600 shadow-xs" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Step {st.step}: {st.title}</span>
                      <span className="px-2 py-0.2 bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold rounded">
                        {st.channel}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-blue-600 font-medium">
                      {st.delay}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed italic">
                    "{st.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Sequence Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">Create Drip Sequence</h3>
            <form onSubmit={handleCreateSequence} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Sequence Name *</label>
                <input
                  type="text"
                  required
                  value={seqName}
                  onChange={(e) => setSeqName(e.target.value)}
                  placeholder="e.g. Design Aspirants 5-Day Nurture"
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Segment</label>
                <input
                  type="text"
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                  placeholder="e.g. B.Des Inquiries with score > 70"
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Trigger Event</label>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Brochure Download">Brochure Download</option>
                  <option value="Form Submitted">Form Submitted</option>
                  <option value="Inactivity > 14 Days">Inactivity &gt; 14 Days</option>
                  <option value="Application Started">Application Started</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Save & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { LeadNurturingPage as NurturingWidget };
export default LeadNurturingPage;
