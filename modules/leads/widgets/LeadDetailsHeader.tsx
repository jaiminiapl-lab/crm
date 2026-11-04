import React from 'react';
import { Lead, Counsellor, LeadStatus, LeadPriority } from '../../../shared/types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { StatusBadge } from '../../../shared/components';

interface LeadDetailsHeaderProps {
  lead: Lead;
  counsellors: Counsellor[];
  canViewPii: boolean;
  maskPhone: (phone: string) => string;
  maskEmail: (email: string) => string;
  hasPermission: (perm: any) => boolean;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onAssignCounsellor: (leadId: string, counsellorId: string) => void;
  onOpenSendMessage: (channel: 'WhatsApp' | 'Email' | 'SMS') => void;
  onConvertToApplication: () => void;
}

export const LeadDetailsHeader: React.FC<LeadDetailsHeaderProps> = ({
  lead,
  counsellors,
  canViewPii,
  maskPhone,
  maskEmail,
  hasPermission,
  onUpdateStatus,
  onAssignCounsellor,
  onOpenSendMessage,
  onConvertToApplication,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Col 1: Student Identity & PII */}
        <div className="space-y-3 lg:border-r lg:border-slate-100 lg:pr-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base border border-blue-100 shrink-0">
              {lead.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 truncate">{lead.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-xs font-semibold text-slate-500">{lead.id}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{lead.source}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono">{canViewPii ? lead.phone : maskPhone(lead.phone)}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{canViewPii ? lead.email : maskEmail(lead.email)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{lead.city}, {lead.state}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consent: {lead.consent.whatsapp ? 'WA ✓' : ''} {lead.consent.email ? 'Email ✓' : ''} {lead.consent.call ? 'Call ✓' : ''}</span>
          </div>
        </div>

        {/* Col 2: Academic Program & Campus */}
        <div className="space-y-2.5 lg:border-r lg:border-slate-100 lg:pr-6">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Program Preference</span>
          <div className="text-sm font-semibold text-slate-900 leading-snug">{lead.interestedCourse}</div>
          <div className="text-xs text-slate-600">
            <span className="text-slate-400">Campus: </span>
            <span className="font-medium text-slate-800">{lead.preferredCampus}</span>
          </div>
          <div className="text-xs text-slate-600">
            <span className="text-slate-400">Academics: </span>
            <span className="font-medium text-slate-800">{lead.academicBackground.percentageOrGpa} ({lead.academicBackground.qualification})</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            {lead.academicBackground.institution} · {lead.academicBackground.passingYear}
          </div>
        </div>

        {/* Col 3: Status, Priority & Counsellor Controls */}
        <div className="space-y-3 lg:border-r lg:border-slate-100 lg:pr-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Admissions Stage</span>
              {!hasPermission('pipeline.stage_change') && (
                <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><Lock className="w-2.5 h-2.5" /> Read-Only</span>
              )}
            </div>
            <select
              value={lead.status}
              disabled={!hasPermission('pipeline.stage_change')}
              onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
              className="w-full text-xs font-semibold px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="New Enquiry">New Enquiry</option>
              <option value="Contact Pending">Contact Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Counselling Scheduled">Counselling Scheduled</option>
              <option value="Application Started">Application Started</option>
              <option value="Documents Pending">Documents Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Admission Approved">Admission Approved</option>
              <option value="Payment Pending">Payment Pending</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Lost / Closed">Lost / Closed</option>
            </select>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Assigned Counsellor</span>
            <select
              value={lead.assignedCounsellorId}
              disabled={!hasPermission('leads.assign')}
              onChange={(e) => onAssignCounsellor(lead.id, e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {counsellors.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Col 4: AI Score & Quick Dispatch */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">AI Conversion Propensity</span>
              <StatusBadge status={lead.scoreCategory} size="sm" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900">{lead.score}/100</span>
              <span className="text-xs text-emerald-600 font-medium">Top Tier Fit</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => onOpenSendMessage('WhatsApp')}
              className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Student
            </button>
            <button
              onClick={onConvertToApplication}
              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Start Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
