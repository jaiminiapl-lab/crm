import React, { useState, useMemo } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { Filter } from 'lucide-react';
import { DashboardKpiStats } from './DashboardKpiStats';
import { DashboardConversionFunnel } from './DashboardConversionFunnel';
import { DashboardLeadSources } from './DashboardLeadSources';
import { DashboardCounsellorWorkload } from './DashboardCounsellorWorkload';
import { DashboardPriorityFollowUps } from './DashboardPriorityFollowUps';

export const DashboardWidget: React.FC = () => {
  const {
    leads,
    tasks,
    appointments,
    applications,
    admissions,
    counsellors,
    courses,
    selectedCampus,
    setCurrentPage,
    setSelectedLeadId,
    toggleTaskCompletion,
  } = useCRM();

  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [selectedCounsellorFilter, setSelectedCounsellorFilter] = useState('All');

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (selectedCampus !== 'All Campuses' && lead.preferredCampus !== selectedCampus) return false;
      if (selectedCourseFilter !== 'All' && lead.interestedCourse !== selectedCourseFilter) return false;
      if (selectedCounsellorFilter !== 'All' && lead.assignedCounsellorId !== selectedCounsellorFilter) return false;
      return true;
    });
  }, [leads, selectedCampus, selectedCourseFilter, selectedCounsellorFilter]);

  // Key KPI metrics
  const totalLeads = filteredLeads.length;
  const newEnquiriesToday = filteredLeads.filter((l) => l.status === 'New Enquiry' || l.status === 'Contact Pending').length;
  const awaitingContact = filteredLeads.filter((l) => l.status === 'Contact Pending').length;
  const followUpsDue = tasks.filter((t) => t.status === 'Pending').length;
  const followUpsOverdue = tasks.filter((t) => t.status === 'Overdue').length;
  const counsellingScheduled = appointments.filter((a) => a.status === 'Scheduled').length;
  const admissionsApproved = admissions.filter((a) => a.offerStatus === 'Issued' || a.offerStatus === 'Accepted').length;
  const totalEnrolments = admissions.filter((a) => a.registrationStatus === 'Enrolled').length;
  const conversionRate = totalLeads > 0 ? ((totalEnrolments / totalLeads) * 100).toFixed(1) : '0.0';

  const funnelStages = [
    { label: 'Total Inquiries', count: totalLeads, pct: 100, color: 'bg-blue-600' },
    {
      label: 'Contacted & Qualified',
      count: filteredLeads.filter((l) => l.status !== 'New Enquiry' && l.status !== 'Contact Pending').length,
      pct: totalLeads ? Math.round((filteredLeads.filter((l) => l.status !== 'New Enquiry').length / totalLeads) * 100) : 0,
      color: 'bg-indigo-600',
    },
    {
      label: 'Counselling Scheduled',
      count: filteredLeads.filter((l) => l.status === 'Counselling Scheduled' || l.applicationsCount > 0).length,
      pct: totalLeads ? Math.round((filteredLeads.filter((l) => l.status === 'Counselling Scheduled' || l.applicationsCount > 0).length / totalLeads) * 100) : 0,
      color: 'bg-violet-600',
    },
    {
      label: 'Applications Filed',
      count: applications.length,
      pct: totalLeads ? Math.round((applications.length / totalLeads) * 100) : 0,
      color: 'bg-purple-600',
    },
    {
      label: 'Admissions Approved',
      count: admissionsApproved,
      pct: totalLeads ? Math.round((admissionsApproved / totalLeads) * 100) : 0,
      color: 'bg-emerald-600',
    },
    {
      label: 'Enrolled & Paid',
      count: totalEnrolments,
      pct: totalLeads ? Math.round((totalEnrolments / totalLeads) * 100) : 0,
      color: 'bg-teal-600',
    },
  ];

  const sources = [
    { name: 'Google Ads', count: 42, pct: 35 },
    { name: 'Website Direct', count: 32, pct: 27 },
    { name: 'Education Portals', count: 21, pct: 18 },
    { name: 'Meta Ads', count: 14, pct: 12 },
    { name: 'Alumni Referral', count: 10, pct: 8 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM & Admissions Performance Dashboard"
        subtitle="Real-time multi-campus admissions pipeline, enquiry conversion metrics, and counselling throughput."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'CRM Dashboard' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('leads')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              View All Leads
            </button>
            <button
              onClick={() => setCurrentPage('pipeline')}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Open Pipeline Kanban
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Active Context:</span>
          <span className="text-slate-900 font-semibold">{selectedCampus}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Program:</span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-hidden"
            >
              <option value="All">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Counsellor:</span>
            <select
              value={selectedCounsellorFilter}
              onChange={(e) => setSelectedCounsellorFilter(e.target.value)}
              className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-hidden"
            >
              <option value="All">All Counsellors</option>
              {counsellors.map((cn) => (
                <option key={cn.id} value={cn.id}>{cn.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DashboardKpiStats
        totalLeads={totalLeads}
        newEnquiriesToday={newEnquiriesToday}
        awaitingContact={awaitingContact}
        followUpsDue={followUpsDue}
        followUpsOverdue={followUpsOverdue}
        counsellingScheduled={counsellingScheduled}
        totalEnrolments={totalEnrolments}
        conversionRate={conversionRate}
        admissionsApproved={admissionsApproved}
        onNavigate={setCurrentPage}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardConversionFunnel stages={funnelStages} onOpenPipeline={() => setCurrentPage('pipeline')} />
        <DashboardLeadSources sources={sources} onOpenCampaigns={() => setCurrentPage('campaigns')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCounsellorWorkload counsellors={counsellors} onManageUsers={() => setCurrentPage('users')} />
        <DashboardPriorityFollowUps
          tasks={tasks}
          onToggleTask={toggleTaskCompletion}
          onSelectLead={(id) => { setSelectedLeadId(id); setCurrentPage('lead-details'); }}
          onViewAllTasks={() => setCurrentPage('tasks')}
        />
      </div>
    </div>
  );
};

export { DashboardWidget as DashboardPage };
export default DashboardWidget;
