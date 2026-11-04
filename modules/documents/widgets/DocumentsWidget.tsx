import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { DocumentRecord } from '../../../shared/types';
import {
  FileCheck2,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  RotateCcw,
  FileText,
  AlertTriangle,
  Download,
  Calendar,
  User,
  ShieldCheck,
  X,
} from 'lucide-react';
import { PermissionGuard } from '../../../shared/components';

export const DocumentVerificationPage: React.FC = () => {
  const { documents, verifyDocument, addToast } = useCRM();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [rejectModalDoc, setRejectModalDoc] = useState<DocumentRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState('The scan is blurry or corners cut off.');

  const filteredDocs = documents.filter((d) => {
    if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    return true;
  });

  const handleApprove = (docId: string) => {
    verifyDocument(docId, true);
  };

  const handleConfirmReject = () => {
    if (!rejectModalDoc) return;
    verifyDocument(rejectModalDoc.id, false, rejectionReason);
    setRejectModalDoc(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Verification & Compliance"
        subtitle="Authenticate educational certificates, government IDs, and entrance scorecards before final enrolment approval."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Document Verification' }]}
      />

      {/* Filter and stats row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="Class 10 Marksheet">Class 10 Marksheet</option>
            <option value="Class 12 Marksheet">Class 12 Marksheet</option>
            <option value="Graduation Degree">Graduation Degree</option>
            <option value="ID Proof / Aadhaar">ID Proof / Aadhaar</option>
            <option value="Transfer Certificate">Transfer Certificate</option>
            <option value="Entrance Scorecard">Entrance Scorecard</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
            <option value="Reupload Requested">Reupload Requested</option>
          </select>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Applicant & App ID</th>
                <th className="py-3 px-4">Document Category</th>
                <th className="py-3 px-4">File Name & Size</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{doc.applicantName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{doc.applicationId}</span>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-800">{doc.category}</td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] text-slate-700 block truncate max-w-[200px]">
                      {doc.fileName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize} · v{doc.version}</span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600">{doc.uploadDate}</td>

                  <td className="py-3 px-4">
                    <StatusBadge status={doc.status} />
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    {doc.reviewer || <span className="text-slate-400 italic">Unassigned</span>}
                    {doc.reviewedAt && (
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {doc.reviewedAt}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Preview Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {doc.status !== 'Verified' && (
                        <PermissionGuard permission="documents.verify">
                          <button
                            onClick={() => handleApprove(doc.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                          >
                            Approve
                          </button>
                        </PermissionGuard>
                      )}

                      {doc.status !== 'Rejected' && (
                        <PermissionGuard permission="documents.reject">
                          <button
                            onClick={() => setRejectModalDoc(doc)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                          >
                            Reject
                          </button>
                        </PermissionGuard>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">{previewDoc.category} Preview</h3>
                <span className="text-xs text-slate-500 font-mono">
                  {previewDoc.fileName} · Applicant: {previewDoc.applicantName}
                </span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document simulated paper view */}
            <div className="my-4 p-6 bg-slate-100/60 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[300px] text-center space-y-3">
              <div className="w-16 h-20 bg-white shadow-md border border-slate-300 rounded flex flex-col items-center justify-center p-2 text-slate-400">
                <FileText className="w-8 h-8 text-blue-600 mb-1" />
                <span className="text-[8px] font-mono font-bold text-slate-600">SEALED</span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Certified Certificate Document
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                  Official digitized certificate submitted for verification in compliance with Academic Regulations.
                </p>
                <span className="font-mono text-[11px] text-slate-400 mt-2 block">
                  SHA-256 Checksum: e4d909c290d0fb1ca068ffaddf22cbd0
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-500">Document Status: <StatusBadge status={previewDoc.status} /></span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleApprove(previewDoc.id);
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                >
                  Confirm & Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">
              Reject / Request Re-upload
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Specify reason for rejecting {rejectModalDoc.category} uploaded by {rejectModalDoc.applicantName}. The student will receive an SMS and email notification to re-upload.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Rejection Reason</label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalDoc(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium"
                >
                  Send Rejection Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { DocumentVerificationPage as DocumentsWidget };
export default DocumentVerificationPage;
