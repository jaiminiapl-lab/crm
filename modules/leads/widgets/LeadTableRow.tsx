import React from 'react';
import { Phone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { Lead } from '../../../shared/types';
import { LeadScoreBadge, LeadPriorityBadge, LeadStageBadge } from '../entities';
import { formatInternationalPhone } from '../../../shared/utils';

interface LeadTableRowProps {
  lead: Lead;
  isSelected: boolean;
  advisorName: string;
  canViewPii: boolean;
  onToggleSelect: (id: string) => void;
  onSelectLead: (id: string) => void;
  onInitiateContact?: (lead: Lead, channel: 'call' | 'whatsapp') => void;
}

export const LeadTableRow: React.FC<LeadTableRowProps> = ({
  lead,
  isSelected,
  advisorName,
  canViewPii,
  onToggleSelect,
  onSelectLead,
  onInitiateContact,
}) => {
  const formattedPhone = formatInternationalPhone(lead.phone, !canViewPii);

  return (
    <tr className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}>
      <td className="py-3.5 pl-4 pr-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(lead.id)}
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </td>
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
            {lead.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <button
              onClick={() => onSelectLead(lead.id)}
              className="font-medium text-slate-900 hover:text-indigo-600 transition-colors text-left"
            >
              {lead.name}
            </button>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>{formattedPhone}</span>
              {!canViewPii && (
                <span title="DPDP PII Masked">
                  <ShieldCheck className="w-3 h-3 text-slate-400" />
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-3">
        <div className="font-medium text-slate-800 text-xs">{lead.interestedCourse}</div>
        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <span>{lead.preferredCampus || 'Mumbai Main Campus'}</span>
          <span className="text-slate-300">•</span>
          <span>{lead.source}</span>
        </div>
      </td>
      <td className="py-3.5 px-3">
        <LeadScoreBadge score={lead.score} />
      </td>
      <td className="py-3.5 px-3">
        <LeadPriorityBadge priority={lead.priority} />
      </td>
      <td className="py-3.5 px-3">
        <LeadStageBadge status={lead.status} />
      </td>
      <td className="py-3.5 px-3">
        <span className="text-xs font-medium text-slate-700">{advisorName}</span>
      </td>
      <td className="py-3.5 pr-4 pl-3 text-right">
        <div className="flex items-center justify-end gap-1">
          {onInitiateContact && (
            <>
              <button
                onClick={() => onInitiateContact(lead, 'call')}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                title="Direct Phone Call"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onInitiateContact(lead, 'whatsapp')}
                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-md transition-colors"
                title="WhatsApp Message"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            onClick={() => onSelectLead(lead.id)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
            title="View Complete Dossier"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
