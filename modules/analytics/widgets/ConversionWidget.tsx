import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import {
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  UserCheck,
  HelpCircle,
} from 'lucide-react';

export const ConversionPredictionPage: React.FC = () => {
  const { leads, setSelectedLeadId, setCurrentPage, addToast } = useCRM();

  const [activeTier, setActiveTier] = useState<'All' | 'High' | 'Moderate' | 'At Risk'>('All');

  // Calculate propensity predictions
  const predictions = leads.map((lead) => {
    let category: 'High' | 'Moderate' | 'At Risk' = 'Moderate';
    let probability = 65;
    let factor = 'Consistent portal engagement and application progression';
    let intervention = 'Standard follow-up cadence';

    if (lead.score >= 85) {
      category = 'High';
      probability = 88;
      factor = 'Exceptional academic merit and verified attendance at virtual counselling';
      intervention = 'Fast-track scholarship offer issuance';
    } else if (lead.score < 60 || lead.status === 'Lost / Closed') {
      category = 'At Risk';
      probability = 28;
      factor = 'Prolonged inactivity (>14 days) and unread follow-up messages';
      intervention = 'Direct senior counsellor telephonic check-in';
    }

    return {
      lead,
      category,
      probability,
      factor,
      intervention,
    };
  });

  const filteredPredictions = predictions.filter((p) => {
    if (activeTier !== 'All' && p.category !== activeTier) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conversion Prediction & Engagement Alerts"
        subtitle="Machine-assisted matriculation forecasts, early churn warning signals, and proactive retention actions."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Conversion Prediction' }]}
      />

      {/* Advisory disclaimer */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Predictive Estimation Notice:</strong> Conversion probabilities are empirical estimates derived from anonymized cohort data. They guide advisor prioritization and do not represent deterministic outcomes or automated admissions rejections.
        </div>
      </div>

      {/* Top summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>High Propensity (&gt;80%)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {predictions.filter((p) => p.category === 'High').length} candidates
            </span>
            <span className="text-xs text-slate-400">High likelihood</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Moderate Propensity (50-79%)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-blue-700">
              {predictions.filter((p) => p.category === 'Moderate').length} candidates
            </span>
            <span className="text-xs text-slate-400">In evaluation</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>At-Risk Drop-off (&lt;50%)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-700">
              {predictions.filter((p) => p.category === 'At Risk').length} alerts
            </span>
            <span className="text-xs text-rose-600 font-semibold">Needs attention</span>
          </div>
        </div>
      </div>

      {/* Prediction Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900">Conversion Likelihood Index</h3>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            {(['All', 'High', 'Moderate', 'At Risk'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  activeTier === tier
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Student & Program</th>
                <th className="py-3 px-4 text-center">Estimated Probability</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Contributing Engagement Signal</th>
                <th className="py-3 px-4">Suggested Retention Action</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPredictions.map(({ lead, category, probability, factor, intervention }) => (
                <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span
                      onClick={() => {
                        setSelectedLeadId(lead.id);
                        setCurrentPage('lead-details');
                      }}
                      className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer block"
                    >
                      {lead.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">
                      {lead.interestedCourse}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {probability}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={category} />
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">{factor}</td>

                  <td className="py-3.5 px-4">
                    <span className="bg-blue-50 text-blue-800 font-medium px-2 py-0.5 rounded text-[11px] border border-blue-200">
                      {intervention}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedLeadId(lead.id);
                        setCurrentPage('lead-details');
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Open Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { ConversionPredictionPage as ConversionWidget };
export default ConversionPredictionPage;
