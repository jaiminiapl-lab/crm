import React from 'react';
import { Users, UserPlus, Clock, CalendarCheck, GraduationCap, ArrowUpRight } from 'lucide-react';
import { PageId } from '../../../shared/services';

interface DashboardKpiStatsProps {
  totalLeads: number;
  newEnquiriesToday: number;
  awaitingContact: number;
  followUpsDue: number;
  followUpsOverdue: number;
  counsellingScheduled: number;
  totalEnrolments: number;
  conversionRate: string;
  admissionsApproved: number;
  onNavigate: (page: PageId) => void;
}

export const DashboardKpiStats: React.FC<DashboardKpiStatsProps> = ({
  totalLeads,
  newEnquiriesToday,
  awaitingContact,
  followUpsDue,
  followUpsOverdue,
  counsellingScheduled,
  totalEnrolments,
  conversionRate,
  admissionsApproved,
  onNavigate,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
      <div
        onClick={() => onNavigate('leads')}
        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium">Total Inquiries</span>
          <Users className="w-4 h-4 text-blue-600" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalLeads}</span>
          <span className="text-[11px] font-medium text-emerald-600 flex items-center">
            +14% <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
        <span className="text-[11px] text-slate-400 mt-1 block">Active academic cycle</span>
      </div>

      <div
        onClick={() => onNavigate('leads')}
        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium">New Enquiries</span>
          <UserPlus className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{newEnquiriesToday}</span>
          <span className="text-[11px] font-medium text-blue-600 flex items-center">Today</span>
        </div>
        <span className="text-[11px] text-slate-400 mt-1 block">{awaitingContact} awaiting contact</span>
      </div>

      <div
        onClick={() => onNavigate('tasks')}
        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-400 cursor-pointer transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium">Follow-Ups Due</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{followUpsDue}</span>
          {followUpsOverdue > 0 && (
            <span className="text-[11px] font-medium text-rose-600">{followUpsOverdue} overdue</span>
          )}
        </div>
        <span className="text-[11px] text-slate-400 mt-1 block">Assigned counsellor tasks</span>
      </div>

      <div
        onClick={() => onNavigate('counselling')}
        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-400 cursor-pointer transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium">Counselling Slots</span>
          <CalendarCheck className="w-4 h-4 text-purple-600" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{counsellingScheduled}</span>
          <span className="text-[11px] font-medium text-purple-600">This week</span>
        </div>
        <span className="text-[11px] text-slate-400 mt-1 block">Virtual & campus visits</span>
      </div>

      <div
        onClick={() => onNavigate('admissions')}
        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 cursor-pointer transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-medium">Total Enrolments</span>
          <GraduationCap className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalEnrolments}</span>
          <span className="text-[11px] font-medium text-emerald-600">{conversionRate}% conv.</span>
        </div>
        <span className="text-[11px] text-slate-400 mt-1 block">{admissionsApproved} offers approved</span>
      </div>
    </div>
  );
};
