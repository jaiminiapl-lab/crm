import React from 'react';
import { Lead, LeadStatus } from '../../../shared/types';
import { PipelineCard } from './PipelineCard';

interface PipelineColumnProps {
  stage: LeadStatus;
  leads: Lead[];
  onSelectLead: (id: string) => void;
  onMoveLead: (leadId: string, currentStage: LeadStatus, direction: 'forward' | 'backward') => void;
  canEdit: boolean;
  canViewPii: boolean;
  stageIndex: number;
  totalStages: number;
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({
  stage,
  leads,
  onSelectLead,
  onMoveLead,
  canEdit,
  canViewPii,
  stageIndex,
  totalStages,
}) => {
  return (
    <div className="w-72 shrink-0 bg-slate-100/70 rounded-xl p-3 flex flex-col max-h-[calc(100vh-230px)] border border-slate-200">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-slate-800 truncate" title={stage}>
            {stage}
          </span>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shrink-0">
          {leads.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
        {leads.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
            No candidates
          </div>
        ) : (
          leads.map((lead) => (
            <PipelineCard
              key={lead.id}
              lead={lead}
              onSelect={onSelectLead}
              onMove={onMoveLead}
              canEdit={canEdit}
              canViewPii={canViewPii}
              isFirstStage={stageIndex === 0}
              isLastStage={stageIndex === totalStages - 1}
            />
          ))
        )}
      </div>
    </div>
  );
};
