import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  PieChart,
  Users,
  Award,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const ReportsAnalyticsPage: React.FC = () => {
  const { counsellors, campaigns, addToast, selectedCampus } = useCRM();

  const [reportPeriod, setReportPeriod] = useState('Academic Year 2026-27');

  const handleExportReport = () => {
    addToast({
      title: 'Executive Report Generated',
      message: 'Download compiled admissions intelligence PDF.',
      type: 'success',
    });
  };

  // Lost leads reasons
  const lostReasons = [
    { reason: 'Accepted offer at Top Tier IIM / IIT / NIT', pct: 42, count: 58 },
    { reason: 'Fee Structure / Financial Constraints', pct: 26, count: 36 },
    { reason: 'Relocation / Family Preferred Home City', pct: 18, count: 25 },
    { reason: 'Did not meet final 12th board eligibility cutoff', pct: 14, count: 19 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI-Assisted Reports & Admissions Analytics"
        subtitle="Executive admissions reporting, counsellor productivity, campaign attribution, and lost-lead attrition analysis."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Reports & Analytics' }]}
        actions={
          <button
            onClick={handleExportReport}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Management Dossier
          </button>
        }
      />

      {/* AI Executive Summary Card */}
      <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Executive Briefing — Admissions Board</span>
          </div>
          <span className="font-mono text-[11px] text-blue-700 font-semibold bg-white px-2 py-0.5 rounded border border-blue-200">
            {reportPeriod}
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Inbound student enquiry volume has surged by <strong>+18.4% YoY</strong>, driven primarily by the B.Tech AI & FinTech MBA programs. Overall inquiry-to-offer conversion currently stands at <strong>23.4%</strong>, tracking 4.2% above institutional budget benchmarks. The primary bottleneck is document verification turnaround (avg. 3.2 days), which is causing an 8% drop-off prior to token fee payment.
        </p>

        <div className="pt-2 border-t border-blue-200/80 flex flex-wrap items-center gap-6 text-xs text-blue-900 font-medium">
          <span>• Recommended Target: Expand Bengaluru Tech Campus B.Des seat quota (+15 seats)</span>
          <span>• Counsellor SLA: 92% of inquiries contacted within 30 minutes</span>
        </div>
      </div>

      {/* Analytics KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Enquiry-to-Admission</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">23.4%</span>
            <span className="text-xs text-emerald-600 font-medium">+3.8%</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Follow-Up SLA Adherence</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-blue-700">92.0%</span>
            <span className="text-xs text-blue-600 font-medium">&lt; 30 min avg</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Counselling Attendance</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">84.2%</span>
            <span className="text-xs text-slate-400">Slots honored</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Blended CAC</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">₹8,420</span>
            <span className="text-xs text-slate-400">per student</span>
          </div>
        </div>
      </div>

      {/* Grid: Counsellor Performance Leaderboard + Lost Leads Attrition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Counsellor League Table (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Counsellor Productivity Matrix</h3>
              <p className="text-xs text-slate-500">Conversions vs assigned targets and response time</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-100">
                  <th className="pb-2">Counsellor Name</th>
                  <th className="pb-2">Campus</th>
                  <th className="pb-2 text-center">Assigned Leads</th>
                  <th className="pb-2 text-center">Conversions</th>
                  <th className="pb-2 text-center">Conv. Rate</th>
                  <th className="pb-2 text-right">Avg SLA Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {counsellors.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-900">{c.name}</td>
                    <td className="py-2.5 text-slate-600">{c.campus}</td>
                    <td className="py-2.5 text-center font-mono">{c.assignedLeadsCount}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-emerald-700">
                      {c.achievedConversions}
                    </td>
                    <td className="py-2.5 text-center font-mono font-semibold text-slate-900">
                      {c.conversionRate}%
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-600">
                      {c.averageResponseTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lost Leads Analysis (1 Col) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Lost-Lead Attrition Analysis</h3>
            <p className="text-xs text-slate-500">Primary reasons declared by lost applicants</p>
          </div>

          <div className="space-y-3.5">
            {lostReasons.map((item) => (
              <div key={item.reason} className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700 truncate max-w-[200px]" title={item.reason}>
                    {item.reason}
                  </span>
                  <span className="font-mono font-bold text-slate-900">{item.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-100">
            * Data collected from mandatory counsellor exit interview disposition logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export { ReportsAnalyticsPage as ReportsWidget };
export default ReportsAnalyticsPage;
