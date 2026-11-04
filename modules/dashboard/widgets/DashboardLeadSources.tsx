import React from 'react';
import { Sparkles } from 'lucide-react';

interface LeadSource {
  name: string;
  count: number;
  pct: number;
}

interface DashboardLeadSourcesProps {
  sources: LeadSource[];
  onOpenCampaigns: () => void;
}

export const DashboardLeadSources: React.FC<DashboardLeadSourcesProps> = ({
  sources,
  onOpenCampaigns,
}) => {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Lead Source Attribution</h3>
          <p className="text-xs text-slate-500">Distribution across inbound channels</p>
        </div>
        <button
          onClick={onOpenCampaigns}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          Campaigns
        </button>
      </div>

      <div className="mt-4 space-y-3.5">
        {sources.map((src) => (
          <div key={src.name} className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">{src.name}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${src.pct}%` }}
                />
              </div>
              <span className="font-mono font-semibold text-slate-900 tabular-nums w-8 text-right">
                {src.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-lg">
        <div className="flex items-center gap-1.5 text-blue-800 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" /> AI Admissions Insight
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Google Ads leads for B.Tech AI convert 2.4× faster when a counselling slot is confirmed within 4 hours of enquiry submission.
        </p>
      </div>
    </div>
  );
};
