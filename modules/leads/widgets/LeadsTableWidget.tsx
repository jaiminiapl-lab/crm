import React from 'react';
import { Lead, Counsellor } from '../../../shared/types';
import { LeadTableRow } from './LeadTableRow';

interface LeadsTableWidgetProps {
  leads: Lead[];
  counsellors: Counsellor[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSelectLead: (id: string) => void;
  canViewPii: boolean;
  canEdit: boolean;
  onInitiateContact?: (lead: Lead, channel: 'call' | 'whatsapp') => void;
}

export const LeadsTableWidget: React.FC<LeadsTableWidgetProps> = ({
  leads,
  counsellors,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onSelectLead,
  canViewPii,
  onInitiateContact,
}) => {
  const counsellorMap = new Map(counsellors.map((c) => [c.id, c.name]));
  const allSelected = leads.length > 0 && selectedIds.length === leads.length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3">Candidate / Contact</th>
              <th className="py-3.5 px-3">Program & Study Hub</th>
              <th className="py-3.5 px-3">AI Score</th>
              <th className="py-3.5 px-3">Priority</th>
              <th className="py-3.5 px-3">Stage</th>
              <th className="py-3.5 px-3">Advisor</th>
              <th className="py-3.5 pr-4 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No applicants match the current search or filter criteria.
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const isSelected = selectedIds.includes(lead.id);
                const advisorName =
                  lead.assignedCounsellorName ||
                  counsellorMap.get(lead.assignedCounsellorId) ||
                  'Unassigned';

                return (
                  <LeadTableRow
                    key={lead.id}
                    lead={lead}
                    isSelected={isSelected}
                    advisorName={advisorName}
                    canViewPii={canViewPii}
                    onToggleSelect={onToggleSelect}
                    onSelectLead={onSelectLead}
                    onInitiateContact={onInitiateContact}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
