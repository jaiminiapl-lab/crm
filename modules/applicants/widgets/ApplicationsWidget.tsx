import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader, StatusBadge } from '../../../shared/components';
import { Application } from '../../../shared/types';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Award,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react';
import { PermissionGuard } from '../../../shared/components';

export const ApplicationsPage: React.FC = () => {
  const {
    applications,
    setApplications,
    courses,
    selectedCampus,
    convertApplicationToStudent,
    addToast,
    setCurrentPage,
  } = useCRM();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppForReview, setSelectedAppForReview] = useState<Application | null>(null);

  const filteredApps = applications.filter((app) => {
    if (selectedCampus !== 'All Campuses' && app.campus !== selectedCampus) return false;
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.applicantName.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q) ||
        app.course.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateAppStatus = (appId: string, newStatus: Application['status'], remark?: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: newStatus,
              remarks: remark || a.remarks,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );
    setSelectedAppForReview(null);
    addToast({
      title: 'Application Decision Saved',
      message: `Application ${appId} status changed to "${newStatus}".`,
      type: newStatus === 'Approved' ? 'success' : newStatus === 'Rejected' ? 'warning' : 'info',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Review & Evaluation"
        subtitle="Process submitted candidate files, verify academic eligibility checklists, and make council admissions decisions."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Applications' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('documents')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Verify Documents Queue
            </button>
          </div>
        }
      />

      {/* Filter and stats bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or APP ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Decision Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-700"
          >
            <option value="All">All Applications</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Approved">Approved</option>
            <option value="Waitlisted">Waitlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Course & Campus</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4 text-center">Completeness</th>
                <th className="py-3 px-4">Doc Status</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No applications found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {app.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{app.applicantName}</div>
                      <span className="text-[11px] text-slate-400 font-mono">{app.phone}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1 max-w-[200px]" title={app.course}>
                        {app.course}
                      </div>
                      <span className="text-[11px] text-slate-500">{app.campus}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">{app.submissionDate}</td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1 w-20">
                        <span className="font-mono text-[11px] font-semibold text-slate-800">
                          {app.completenessPercent}%
                        </span>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              app.completenessPercent === 100
                                ? 'bg-emerald-500'
                                : app.completenessPercent > 70
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${app.completenessPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={app.documentStatus} />
                    </td>

                    <td className="py-3 px-4 text-slate-700">{app.assignedReviewer}</td>

                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <PermissionGuard permission="admissions.evaluate">
                        <button
                          onClick={() => setSelectedAppForReview(app)}
                          className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          Evaluate
                        </button>
                      </PermissionGuard>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Decision Evaluation Modal */}
      {selectedAppForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Admissions Evaluation: {selectedAppForReview.applicantName}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedAppForReview.id} · {selectedAppForReview.course}
                </span>
              </div>
              <button
                onClick={() => setSelectedAppForReview(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Eligibility checklist */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Eligibility Criteria Verification
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Academic Cutoff &gt; 60% Met</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Entrance Scorecard Validated</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Identity Proof (Aadhaar/Passport)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Faculty Board Interview Cleared</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Entrance Score / Aptitude:</span>
                <span className="font-semibold text-slate-800 font-mono text-sm">
                  {selectedAppForReview.entranceScore || 'State Common Entrance (Qualified)'}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Admissions Council Remarks
                </label>
                <textarea
                  rows={2}
                  defaultValue={selectedAppForReview.remarks || ''}
                  placeholder="Record council scholarship grant or specific contingencies..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Action Decision buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <PermissionGuard permission="admissions.reject">
                  <button
                    type="button"
                    onClick={() => handleUpdateAppStatus(selectedAppForReview.id, 'Waitlisted')}
                    className="px-3 py-1.5 border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-lg font-medium text-xs"
                  >
                    Move to Waitlist
                  </button>
                </PermissionGuard>

                <div className="flex items-center gap-2">
                  <PermissionGuard permission="admissions.reject">
                    <button
                      type="button"
                      onClick={() => handleUpdateAppStatus(selectedAppForReview.id, 'Rejected')}
                      className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg font-medium text-xs"
                    >
                      Reject
                    </button>
                  </PermissionGuard>

                  <PermissionGuard permission="admissions.approve_offer">
                    <button
                      type="button"
                      onClick={() => handleUpdateAppStatus(selectedAppForReview.id, 'Approved')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Admission Offer
                    </button>
                  </PermissionGuard>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ApplicationsPage as ApplicationsWidget };
export default ApplicationsPage;
