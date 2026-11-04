import React from 'react';
import { ArrowRight, ArrowLeft, User, GraduationCap, MapPin } from 'lucide-react';
import { Lead, LeadStatus } from '../../../shared/types';
import { LeadScoreBadge, LeadPriorityBadge } from '../../leads/entities';

interface PipelineCardProps {
  lead: Lead;
  onSelect: (id: string) => void;
  onMove: (leadId: string, currentStage: LeadStatus, direction: 'forward' | 'backward') => void;
  canEdit: boolean;
  canViewPii: boolean;
  isFirstStage: boolean;
  isLastStage: boolean;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
  lead,
  onSelect,
  onMove,
  canEdit,
  isFirstStage,
  isLastStage,
}) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all space-y-2">
      <div className="flex items-start justify-between gap-1.5">
        <button
          onClick={() => onSelect(lead.id)}
          className="font-medium text-xs text-slate-900 hover:text-indigo-600 transition-colors text-left line-clamp-1"
        >
          {lead.name}
        </button>
        <LeadScoreBadge score={lead.score} size="sm" />
      </div>

      <div className="text-[11px] text-slate-600 flex items-center gap-1 line-clamp-1">
        <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
        <span>{lead.interestedCourse}</span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1 line-clamp-1">
          <User className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{lead.assignedCounsellorName}</span>
        </div>
        <LeadPriorityBadge priority={lead.priority} />
      </div>

      {canEdit && (
        <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-50">
          <button
            disabled={isFirstStage}
            onClick={() => onMove(lead.id, lead.status, 'backward')}
            className={`p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ${
              isFirstStage ? 'opacity-20 cursor-not-allowed' : ''
            }`}
            title="Move to previous stage"
          >
            <ArrowLeft className="w-3 h-3" />
          </button>
          <span className="text-[10px] text-slate-400">{lead.id}</span>
          <button
            disabled={isLastStage}
            onClick={() => onMove(lead.id, lead.status, 'forward')}
            className={`p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ${
              isLastStage ? 'opacity-20 cursor-not-allowed' : ''
            }`}
            title="Advance to next stage"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
