import React from 'react';
import { Lead, LeadStatus } from '../../../shared/types';
import { PipelineColumn } from './PipelineColumn';

interface PipelineKanbanWidgetProps {
  stages: LeadStatus[];
  leads: Lead[];
  onSelectLead: (id: string) => void;
  onMoveLead: (leadId: string, currentStage: LeadStatus, direction: 'forward' | 'backward') => void;
  canEdit: boolean;
  canViewPii: boolean;
}

export const PipelineKanbanWidget: React.FC<PipelineKanbanWidgetProps> = ({
  stages,
  leads,
  onSelectLead,
  onMoveLead,
  canEdit,
  canViewPii,
}) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 pt-1">
      {stages.map((stage, idx) => {
        const stageLeads = leads.filter((l) => l.status === stage);
        return (
          <PipelineColumn
            key={stage}
            stage={stage}
            leads={stageLeads}
            onSelectLead={onSelectLead}
            onMoveLead={onMoveLead}
            canEdit={canEdit}
            canViewPii={canViewPii}
            stageIndex={idx}
            totalStages={stages.length}
          />
        );
      })}
    </div>
  );
};
