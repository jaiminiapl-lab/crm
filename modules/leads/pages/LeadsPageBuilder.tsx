import React, { useState, useMemo } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { LeadsStatsWidget, LeadsTableWidget } from '../widgets';
import {
  LeadFilterBar,
  LeadBulkActionsBar,
  AddLeadModal,
  LeadFilterState,
  filterLeads,
} from '../features';
import { Lead, LeadStatus } from '../../../shared/types';
import { UserPlus } from 'lucide-react';

export const LeadsPageBuilder: React.FC = () => {
  const {
    leads,
    counsellors,
    courses,
    selectedCampus,
    setCurrentPage,
    setSelectedLeadId,
    assignLead,
    updateLeadStatus,
    addLead,
    addToast,
    hasPermission,
  } = useCRM();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<LeadFilterState>({
    search: '',
    status: 'ALL',
    course: 'ALL',
    campus: selectedCampus !== 'All Campuses' ? selectedCampus : 'ALL',
    scoreTier: 'ALL',
  });

  const canViewPii = hasPermission('leads.view_pii');
  const canAssign = hasPermission('leads.bulk_assign');
  const canCreate = hasPermission('leads.create');

  const filteredLeads = useMemo(() => filterLeads(leads, filters), [leads, filters]);

  const handleSelectLead = (id: string) => {
    setSelectedLeadId(id);
    setCurrentPage('lead-details');
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleToggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredLeads.length ? [] : filteredLeads.map((l) => l.id));
  };

  const handleBulkAssign = (counsellorId: string) => {
    selectedIds.forEach((id) => assignLead(id, counsellorId));
    setSelectedIds([]);
    addToast({
      title: 'Bulk Assignment Complete',
      message: `Assigned ${selectedIds.length} candidate(s) to selected admissions advisor.`,
      type: 'success',
    });
  };

  const handleBulkStatusChange = (status: LeadStatus) => {
    selectedIds.forEach((id) => updateLeadStatus(id, status));
    setSelectedIds([]);
    addToast({
      title: 'Pipeline Updated',
      message: `Updated status to "${status}" for ${selectedIds.length} candidate(s).`,
      type: 'info',
    });
  };

  const handleInitiateContact = (lead: Lead, channel: 'call' | 'whatsapp') => {
    addToast({
      title: channel === 'call' ? 'Dialing Candidate' : 'Launching WhatsApp',
      message: `Initiating ${channel} session with ${lead.name} (${lead.phone}).`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="International Applicant Management"
        subtitle={`Tracking ${leads.length} candidates across global study centres with AI qualification`}
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Applicants' }]}
        actions={
          canCreate ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              Capture New Inquiry
            </button>
          ) : undefined
        }
      />

      <LeadsStatsWidget leads={leads} />

      <LeadFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({ search: '', status: 'ALL', course: 'ALL', campus: 'ALL', scoreTier: 'ALL' })
        }
        courses={courses}
        activeCount={filteredLeads.length}
      />

      <LeadBulkActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        counsellors={counsellors}
        onBulkAssign={handleBulkAssign}
        onBulkStatusChange={handleBulkStatusChange}
        canAssign={canAssign}
      />

      <LeadsTableWidget
        leads={filteredLeads}
        counsellors={counsellors}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onSelectLead={handleSelectLead}
        canViewPii={canViewPii}
        canEdit={canAssign}
        onInitiateContact={handleInitiateContact}
      />

      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addLead}
        courses={courses}
        counsellors={counsellors}
      />
    </div>
  );
};

export default LeadsPageBuilder;
