import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader, ConfirmModal } from '../../../shared/components';
import { PipelineKanbanWidget } from '../widgets';
import { LeadStatus } from '../../../shared/types';
import { Search } from 'lucide-react';

const STAGES: LeadStatus[] = [
  'New Enquiry',
  'Contact Pending',
  'Contacted',
  'Interested',
  'Counselling Scheduled',
  'Application Started',
  'Documents Pending',
  'Under Review',
  'Admission Approved',
  'Payment Pending',
  'Enrolled',
  'Lost / Closed',
];

export const PipelinePage: React.FC = () => {
  const {
    leads,
    updateLeadStatus,
    setSelectedLeadId,
    setCurrentPage,
    selectedCampus,
    hasPermission,
  } = useCRM();

  const [pipelineSearch, setPipelineSearch] = useState('');
  const [confirmModalData, setConfirmModalData] = useState<{
    isOpen: boolean;
    leadId: string;
    targetStage: LeadStatus;
    leadName: string;
  }>({
    isOpen: false,
    leadId: '',
    targetStage: 'Enrolled',
    leadName: '',
  });

  const canEdit = hasPermission('leads.edit');
  const canViewPii = hasPermission('leads.view_pii');

  const filteredLeads = leads.filter((lead) => {
    if (selectedCampus !== 'All Campuses' && lead.preferredCampus !== selectedCampus) return false;
    if (pipelineSearch.trim()) {
      const q = pipelineSearch.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.interestedCourse.toLowerCase().includes(q) ||
        lead.assignedCounsellorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStageMove = (leadId: string, currentStage: LeadStatus, direction: 'forward' | 'backward') => {
    const currentIndex = STAGES.indexOf(currentStage);
    const targetIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < STAGES.length) {
      const targetStage = STAGES[targetIndex];
      const lead = leads.find((l) => l.id === leadId);

      if (targetStage === 'Enrolled' || targetStage === 'Lost / Closed') {
        setConfirmModalData({
          isOpen: true,
          leadId,
          targetStage,
          leadName: lead?.name || leadId,
        });
      } else {
        updateLeadStatus(leadId, targetStage);
      }
    }
  };

  const handleConfirmTransition = () => {
    updateLeadStatus(confirmModalData.leadId, confirmModalData.targetStage);
    setConfirmModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSelectLead = (id: string) => {
    setSelectedLeadId(id);
    setCurrentPage('lead-details');
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Visual Pipeline & Funnel"
        subtitle="12-stage international qualification workflow across global campuses"
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Pipeline' }]}
        actions={
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={pipelineSearch}
              onChange={(e) => setPipelineSearch(e.target.value)}
              placeholder="Search pipeline cards..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>
        }
      />

      <PipelineKanbanWidget
        stages={STAGES}
        leads={filteredLeads}
        onSelectLead={handleSelectLead}
        onMoveLead={handleStageMove}
        canEdit={canEdit}
        canViewPii={canViewPii}
      />

      <ConfirmModal
        isOpen={confirmModalData.isOpen}
        onCancel={() => setConfirmModalData((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmTransition}
        title={`Advance to ${confirmModalData.targetStage}?`}
        description={`Are you sure you want to transition candidate "${confirmModalData.leadName}" to "${confirmModalData.targetStage}"? This will trigger automated onboarding workflows.`}
        confirmLabel={`Confirm ${confirmModalData.targetStage}`}
        variant={confirmModalData.targetStage === 'Lost / Closed' ? 'danger' : 'primary'}
      />
    </div>
  );
};

export { PipelinePage as PipelinePageBuilder };
export default PipelinePage;
