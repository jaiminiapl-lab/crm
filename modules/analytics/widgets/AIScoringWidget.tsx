import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Flame,
  Clock,
  Filter,
} from 'lucide-react';

export const AIScoringPage: React.FC = () => {
  const { leads, setSelectedLeadId, setCurrentPage, addToast } = useCRM();

  const [scoreFilter, setScoreFilter] = useState<'All' | 'Hot' | 'Warm' | 'Cold'>('All');
  const [selectedLeadForAnalysis, setSelectedLeadForAnalysis] = useState(leads[0] || null);

  const filteredLeads = leads.filter((l) => {
    if (scoreFilter !== 'All' && l.scoreCategory !== scoreFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Lead Scoring & Prioritization"
        subtitle="Algorithmic propensity scoring based on academic merit, portal engagement, and behavioral intent."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'AI Lead Scoring' }]}
      />

      {/* Mandatory ethical AI scoring disclaimer */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Propensity Advisory Notice:</strong> Predictive scores are decision-support recommendations generated from digital interactions and historical matriculation patterns. Scores do not constitute automatic admission offers, rejections, or guarantees of student enrolment.
        </div>
      </div>

      {/* Grid: Scoring Roster (2 Cols) + Deep Score Breakdown (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ranked Leads List */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Lead Scoring Index</h3>
              <p className="text-xs text-slate-500">Sorted by dynamic conversion propensity</p>
            </div>

            {/* Segmented filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              {(['All', 'Hot', 'Warm', 'Cold'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setScoreFilter(cat)}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    scoreFilter === cat
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 space-y-2">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadForAnalysis(lead)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedLeadForAnalysis?.id === lead.id
                    ? 'border-blue-500 bg-blue-50/20'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{lead.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">({lead.id})</span>
                    <StatusBadge status={lead.scoreCategory} size="sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Score:</span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        lead.score >= 85
                          ? 'text-emerald-700'
                          : lead.score >= 60
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {lead.score}/100
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 mt-1.5">
                  <span className="truncate max-w-[320px]">{lead.interestedCourse}</span>
                  <span className="text-[11px] text-slate-400">
                    Engagement: <strong className="text-slate-700">{lead.engagementLevel}</strong>
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {lead.scoreExplanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Lead Factor Analysis */}
        {selectedLeadForAnalysis && (
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Factor Attribution Breakdown
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedLeadForAnalysis.name}
              </h3>
              <p className="text-xs text-slate-500">{selectedLeadForAnalysis.interestedCourse}</p>
            </div>

            {/* Score Ring */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="text-3xl font-extrabold font-mono text-blue-700">
                {selectedLeadForAnalysis.score}
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {selectedLeadForAnalysis.scoreCategory} Priority Index
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                {selectedLeadForAnalysis.scoreExplanation}
              </p>
            </div>

            {/* Contributing factors */}
            <div className="space-y-3 text-xs">
              <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block">
                Signal Weight Breakdown
              </span>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Academic Eligibility & Cutoffs</span>
                  <span className="font-mono font-semibold text-emerald-700">+35 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[90%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Brochure & Curriculum Downloads</span>
                  <span className="font-mono font-semibold text-blue-700">+25 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[80%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Virtual Open House Attendance</span>
                  <span className="font-mono font-semibold text-purple-700">+20 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[65%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Parent Engagement During Calls</span>
                  <span className="font-mono font-semibold text-indigo-700">+15 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-[50%]" />
                </div>
              </div>
            </div>

            {/* Suggested Action */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Suggested Counsellor Action
              </span>
              <p className="text-xs text-slate-700 font-medium bg-blue-50/70 p-2.5 rounded-lg border border-blue-200/80">
                Offer a priority campus tour of the engineering research clusters and connect the parent with Financial Aid office for early merit fee grant.
              </p>

              <button
                onClick={() => {
                  setSelectedLeadId(selectedLeadForAnalysis.id);
                  setCurrentPage('lead-details');
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors"
              >
                Open Full Student Dossier $\rightarrow$
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { AIScoringPage as AIScoringWidget };
export default AIScoringPage;
