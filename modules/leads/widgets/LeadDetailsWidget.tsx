import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { LeadStatus } from '../../../shared/types';
import { LeadDetailsHeader } from './LeadDetailsHeader';
import { LeadTimelineTab } from './LeadTimelineTab';
import { LeadTasksTab } from './LeadTasksTab';
import { LeadNotesTab } from './LeadNotesTab';
import { LeadApplicationsTab } from './LeadApplicationsTab';
import { LeadDocumentsTab } from './LeadDocumentsTab';
import { LeadSendMessageModal } from './LeadSendMessageModal';

export const LeadDetailsWidget: React.FC = () => {
  const {
    leads,
    selectedLeadId,
    setCurrentPage,
    counsellors,
    updateLeadStatus,
    assignLead,
    tasks,
    appointments,
    applications,
    documents,
    messages,
    addToast,
    maskPhone,
    maskEmail,
    hasPermission,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'timeline' | 'tasks' | 'notes' | 'applications' | 'documents'>('timeline');
  const [isSendMessageOpen, setIsSendMessageOpen] = useState(false);
  const [messageChannel, setMessageChannel] = useState<'WhatsApp' | 'Email' | 'SMS'>('WhatsApp');

  const lead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  if (!lead) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No lead selected.</p>
        <button
          onClick={() => setCurrentPage('leads')}
          className="mt-3 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg cursor-pointer"
        >
          Return to Leads
        </button>
      </div>
    );
  }

  const leadTasks = tasks.filter((t) => t.leadId === lead.id);
  const leadAppointments = appointments.filter((a) => a.leadId === lead.id);
  const leadApps = applications.filter((a) => a.applicantId === lead.id || a.email === lead.email);
  const leadDocs = documents.filter((d) => d.leadId === lead.id || d.applicantName === lead.name);
  const leadMsgs = messages.filter((m) => m.leadId === lead.id);

  const handleAddNote = (noteText: string) => {
    addToast({
      title: 'Note Recorded',
      message: `Note added to student dossier: "${noteText.slice(0, 30)}..."`,
      type: 'success',
    });
  };

  const handleSendMessage = (channel: 'WhatsApp' | 'Email' | 'SMS', body: string) => {
    addToast({
      title: `Message Dispatched (${channel})`,
      message: `Message sent to ${lead.name} (${channel === 'Email' ? lead.email : lead.phone}).`,
      type: 'success',
    });
    setIsSendMessageOpen(false);
  };

  const handleConvertToApplication = () => {
    addToast({
      title: 'Application Initiated',
      message: `Application dossier generated for ${lead.name}.`,
      type: 'success',
    });
    setCurrentPage('applications');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applicant Dossier & Timeline"
        subtitle="360-degree omnichannel history, counseling records, and verification state."
        breadcrumbs={[
          { label: 'Home', page: 'dashboard' },
          { label: 'Leads', page: 'leads' },
          { label: lead.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('leads')}
              className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Back to Leads
            </button>
            <button
              onClick={() => setCurrentPage('counselling')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Schedule Counselling
            </button>
          </div>
        }
      />

      <LeadDetailsHeader
        lead={lead}
        counsellors={counsellors}
        canViewPii={hasPermission('leads.view_pii')}
        maskPhone={maskPhone}
        maskEmail={maskEmail}
        hasPermission={hasPermission}
        onUpdateStatus={updateLeadStatus}
        onAssignCounsellor={assignLead}
        onOpenSendMessage={(ch) => { setMessageChannel(ch); setIsSendMessageOpen(true); }}
        onConvertToApplication={handleConvertToApplication}
      />

      {/* Tabs Container */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/70 overflow-x-auto">
          {[
            { id: 'timeline', label: 'Activity Timeline' },
            { id: 'tasks', label: `Follow-Ups & Tasks (${leadTasks.length})` },
            { id: 'notes', label: `Counsellor Notes (${lead.notesCount})` },
            { id: 'applications', label: `Applications (${leadApps.length})` },
            { id: 'documents', label: `Verified Documents (${leadDocs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'timeline' && <LeadTimelineTab lead={lead} appointments={leadAppointments} messages={leadMsgs} />}
          {activeTab === 'tasks' && <LeadTasksTab tasks={leadTasks} onCreateTask={() => setCurrentPage('tasks')} />}
          {activeTab === 'notes' && <LeadNotesTab lead={lead} onAddNote={handleAddNote} />}
          {activeTab === 'applications' && (
            <LeadApplicationsTab
              applications={leadApps}
              onStartApplication={handleConvertToApplication}
              onInspectApplication={() => setCurrentPage('applications')}
            />
          )}
          {activeTab === 'documents' && (
            <LeadDocumentsTab documents={leadDocs} onReviewDocuments={() => setCurrentPage('documents')} />
          )}
        </div>
      </div>

      <LeadSendMessageModal
        isOpen={isSendMessageOpen}
        lead={lead}
        defaultChannel={messageChannel}
        onClose={() => setIsSendMessageOpen(false)}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export { LeadDetailsWidget as LeadDetailsPage };
export default LeadDetailsWidget;
