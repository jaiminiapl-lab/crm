import React from 'react';
import { Counsellor } from '../../../shared/types';

interface DashboardCounsellorWorkloadProps {
  counsellors: Counsellor[];
  onManageUsers: () => void;
}

export const DashboardCounsellorWorkload: React.FC<DashboardCounsellorWorkloadProps> = ({
  counsellors,
  onManageUsers,
}) => {
  return (
    <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Counsellor Workload & Performance</h3>
          <p className="text-xs text-slate-500">Monthly conversion target attainment and response speed</p>
        </div>
        <button
          onClick={onManageUsers}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          Manage Counsellors
        </button>
      </div>

      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 font-medium border-b border-slate-100">
              <th className="pb-2 font-medium">Counsellor</th>
              <th className="pb-2 font-medium">Campus</th>
              <th className="pb-2 font-medium text-center">Active Leads</th>
              <th className="pb-2 font-medium text-center">Target</th>
              <th className="pb-2 font-medium text-center">Conversions</th>
              <th className="pb-2 font-medium text-right">Avg Response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {counsellors.slice(0, 5).map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 font-medium text-slate-900">
                  <div>{c.name}</div>
                  <span className="text-[10px] text-slate-400">{c.role}</span>
                </td>
                <td className="py-2.5 text-slate-600">{c.campus.replace('Campus', '').trim()}</td>
                <td className="py-2.5 text-center font-mono tabular-nums">
                  <span className="font-semibold text-slate-800">{c.assignedLeadsCount}</span>
                  <span className="text-[10px] text-slate-400">/{c.maxCapacity}</span>
                </td>
                <td className="py-2.5 text-center font-mono tabular-nums text-slate-600">
                  {c.monthlyTarget}
                </td>
                <td className="py-2.5 text-center font-mono tabular-nums">
                  <span className="font-semibold text-emerald-700">{c.achievedConversions}</span>
                  <span className="text-[10px] text-slate-400 ml-1">({c.conversionRate}%)</span>
                </td>
                <td className="py-2.5 text-right font-mono text-slate-600">{c.averageResponseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
