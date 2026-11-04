import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import {
  Bot,
  Sparkles,
  User,
  Copy,
  Check,
  Send,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ListCheck,
} from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { leads, addToast, setCurrentPage, setSelectedLeadId } = useCRM();

  const [activeLeadId, setActiveLeadId] = useState(leads[0]?.id || '');
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentLead = leads.find((l) => l.id === activeLeadId) || leads[0];

  // Editable generated draft
  const [draftContent, setDraftContent] = useState(
    `Dear ${currentLead?.name},\n\nI noticed you have been exploring our ${currentLead?.interestedCourse} curriculum. Given your outstanding background in ${currentLead?.academicBackground.qualification} (${currentLead?.academicBackground.percentageOrGpa}), you are pre-qualified for our Dean's Merit Scholarship evaluation.\n\nWould you and your family be available for a 20-minute consultation this Thursday or Friday to discuss elective specializations, campus labs, and hostel facilities?\n\nWarm regards,\n${currentLead?.assignedCounsellorName}\nAdmissions Office, IAPL LMS`
  );

  const handleLeadChange = (id: string) => {
    setActiveLeadId(id);
    const l = leads.find((item) => item.id === id) || leads[0];
    setDraftContent(
      `Dear ${l.name},\n\nI noticed you have been exploring our ${l.interestedCourse} curriculum. Given your outstanding background in ${l.academicBackground.qualification} (${l.academicBackground.percentageOrGpa}), you are pre-qualified for our Dean's Merit Scholarship evaluation.\n\nWould you and your family be available for a 20-minute consultation this Thursday or Friday to discuss elective specializations, campus labs, and hostel facilities?\n\nWarm regards,\n${l.assignedCounsellorName}\nAdmissions Office, IAPL LMS`
    );
  };

  const handleCopyDraft = () => {
    navigator.clipboard?.writeText(draftContent);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
    addToast({
      title: 'Copied to Clipboard',
      message: 'Personalized counsellor draft ready to paste into WhatsApp or Email.',
      type: 'info',
    });
  };

  const handleRegenerateDraft = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setDraftContent(
        `Hi ${currentLead.name}! Following up on your enquiry for ${currentLead.interestedCourse}. We are hosting an exclusive Virtual Interactive Lab Showcase this Saturday for ${currentLead.city} applicants. Would you like me to reserve your entry pass?\n\nBest,\n${currentLead.assignedCounsellorName}`
      );
      addToast({
        title: 'Draft Refreshed',
        message: 'Generated alternate high-engagement follow-up angle.',
        type: 'success',
      });
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Counsellor Assistant & Co-Pilot"
        subtitle="Context-aware counselling prep, objection handling scripts, and human-in-the-loop personalized outreach."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'AI Counsellor Assistant' }]}
      />

      {/* Mandatory Human Review Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Human-in-the-Loop Governance:</strong> Review and verify all AI recommendations and drafts before sending communications or updating student academic files.
          </span>
        </div>
      </div>

      {/* Grid: Context & Questions (1 Col) + Draft Studio (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lead Selector & Context */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Active Student Record
            </label>
            <select
              value={activeLeadId}
              onChange={(e) => handleLeadChange(e.target.value)}
              className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.id})
                </option>
              ))}
            </select>
          </div>

          {/* Student Dossier Summary */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{currentLead.name}</span>
              <StatusBadge status={currentLead.status} size="sm" />
            </div>
            <div className="text-slate-600">
              <span className="text-slate-400">Target Program: </span>
              <strong className="text-slate-800">{currentLead.interestedCourse}</strong>
            </div>
            <div className="text-slate-600">
              <span className="text-slate-400">Campus: </span>
              <span>{currentLead.preferredCampus}</span>
            </div>
            <div className="text-slate-600">
              <span className="text-slate-400">Score & Prior Year: </span>
              <span>
                {currentLead.academicBackground.percentageOrGpa} ({currentLead.academicBackground.qualification})
              </span>
            </div>
          </div>

          {/* Suggested Counselling Questions to Ask during call */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block">
              Suggested Diagnostic Questions
            </span>
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 space-y-2 text-slate-700">
              <p className="leading-snug">
                1. "What specific domain of AI/Robotics or FinTech are you looking to specialize in for your final year capstone?"
              </p>
              <p className="leading-snug">
                2. "Have you explored our merit-based scholarship tiers for students scoring above 85% in 12th/Graduation?"
              </p>
              <p className="leading-snug">
                3. "Would your parents like to tour the campus research labs and hostel complexes before submitting the registration deposit?"
              </p>
            </div>
          </div>

          {/* Missing info checklist */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block">
              Information Gap Checklist
            </span>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-center gap-1.5">
                <ListCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Parent / Guardian secondary phone number</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ListCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Entrance exam roll number / percentile scorecard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ListCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hostel / accommodation preference indicated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editable Outreach Studio (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Personalized Counsellor Follow-Up Draft
                </h3>
              </div>
              <button
                onClick={handleRegenerateDraft}
                disabled={isGenerating}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Drafting...' : 'Regenerate Draft'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Editable Message Body (Review and tweak before sending)
              </label>
              <textarea
                rows={9}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="w-full p-3 text-xs leading-relaxed border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-sans text-slate-800"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              Assigned to: <strong className="text-slate-700">{currentLead.assignedCounsellorName}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyDraft}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-1.5"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedDraft ? 'Copied!' : 'Copy to Clipboard'}
              </button>

              <button
                onClick={() => {
                  addToast({
                    title: 'Message Queued',
                    message: `Approved message queued to ${currentLead.name} via verified channel.`,
                    type: 'success',
                  });
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" /> Approve & Dispatch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AIAssistantPage as AIAssistantWidget };
export default AIAssistantPage;
