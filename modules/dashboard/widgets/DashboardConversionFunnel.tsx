import React from 'react';
import { ChevronRight } from 'lucide-react';

interface FunnelStage {
  label: string;
  count: number;
  pct: number;
  color: string;
}

interface DashboardConversionFunnelProps {
  stages: FunnelStage[];
  onOpenPipeline: () => void;
}

export const DashboardConversionFunnel: React.FC<DashboardConversionFunnelProps> = ({
  stages,
  onOpenPipeline,
}) => {
  return (
    <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Admissions Conversion Funnel</h3>
          <p className="text-xs text-slate-500">From initial digital enquiry to confirmed fee payment</p>
        </div>
        <button
          onClick={onOpenPipeline}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
        >
          Open Pipeline <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {stages.map((stage) => (
          <div key={stage.label}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">{stage.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {stage.count} students
                </span>
                <span className="text-slate-400 font-mono text-[11px]">({stage.pct}%)</span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${stage.color}`}
                style={{ width: `${Math.max(stage.pct, 4)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-[11px] text-slate-500 block">Avg. Inquiry to Call</span>
          <span className="text-sm font-semibold text-slate-900 font-mono">18 mins</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 block">Counselling Attendance</span>
          <span className="text-sm font-semibold text-slate-900 font-mono">84.2%</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 block">Offer Acceptance Rate</span>
          <span className="text-sm font-semibold text-slate-900 font-mono">72.5%</span>
        </div>
      </div>
    </div>
  );
};
