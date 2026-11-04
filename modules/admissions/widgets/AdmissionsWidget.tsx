import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { AdmissionRecord } from '../../../shared/types';
import {
  GraduationCap,
  CheckCircle,
  Clock,
  DollarSign,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Search,
  Check,
  Download,
  X,
} from 'lucide-react';
import { PermissionGuard } from '../../../shared/components';

export const AdmissionsEnrolmentPage: React.FC = () => {
  const { admissions, setAdmissions, addToast, maskCurrency, hasPermission } = useCRM();

  const [selectedOfferToConvert, setSelectedOfferToConvert] = useState<AdmissionRecord | null>(null);
  const [feeStatusFilter, setFeeStatusFilter] = useState('All');

  const filteredAdmissions = admissions.filter((adm) => {
    if (feeStatusFilter !== 'All' && adm.feeStatus !== feeStatusFilter) return false;
    return true;
  });

  const handleConfirmConvert = () => {
    if (!selectedOfferToConvert) return;

    const generatedId = `IAPL-2026-STU-${Math.floor(1000 + Math.random() * 9000)}`;

    setAdmissions((prev) =>
      prev.map((a) =>
        a.id === selectedOfferToConvert.id
          ? {
              ...a,
              registrationStatus: 'Enrolled',
              studentId: generatedId,
              feeStatus: 'Paid in Full',
              feePaid: a.feeAmount,
              onboardingStepsCompleted: 5,
            }
          : a
      )
    );

    addToast({
      title: 'Enrolment Finalized!',
      message: `Student registered: ${selectedOfferToConvert.studentName} (ID: ${generatedId}). LMS account dispatched.`,
      type: 'success',
    });

    setSelectedOfferToConvert(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions & Student Enrolment"
        subtitle="Manage approved candidate offers, token fee collection, student ID generation, and onboarding transition."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Admissions & Enrolment' }]}
      />

      {/* Top summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Offers Issued</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {admissions.length}
            </span>
            <span className="text-xs text-blue-600 font-semibold">Active Cycle</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Enrolled Students</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {admissions.filter((a) => a.registrationStatus === 'Enrolled').length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Confirmed</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Token Fees Pending</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-700">
              {admissions.filter((a) => a.feeStatus !== 'Paid in Full').length}
            </span>
            <span className="text-xs text-amber-600 font-semibold">Awaiting Fee</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Fees Collected</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-900">
              ₹
              {(
                admissions.reduce((acc, curr) => acc + curr.feePaid, 0) / 100000
              ).toFixed(2)}{' '}
              Lakhs
            </span>
            <span className="text-xs text-slate-400 font-medium">INR</span>
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Admissions Roster</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Fee Status:</span>
            <select
              value={feeStatusFilter}
              onChange={(e) => setFeeStatusFilter(e.target.value)}
              className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Paid in Full">Paid in Full</option>
              <option value="Partial / Token Paid">Partial / Token Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Student & Offer Ref</th>
                <th className="py-3 px-4">Enrolled Program</th>
                <th className="py-3 px-4">Offer Date</th>
                <th className="py-3 px-4">Offer Status</th>
                <th className="py-3 px-4">Tuition Fee Status</th>
                <th className="py-3 px-4">Student ID / Status</th>
                <th className="py-3 px-4">Onboarding Steps</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmissions.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{adm.studentName}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {adm.id} · {adm.campus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800 max-w-[200px] truncate">
                    {adm.course}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600">{adm.offerDate}</td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={adm.offerStatus} />
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <StatusBadge status={adm.feeStatus} />
                      <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                        <span>
                          {maskCurrency(adm.feePaid)} / {maskCurrency(adm.feeAmount)}
                        </span>
                        {!hasPermission('admissions.view_financials') && (
                          <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                            Restricted
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {adm.studentId ? (
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {adm.studentId}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Pending Conversion</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-slate-700">
                        {adm.onboardingStepsCompleted}/{adm.totalOnboardingSteps}
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${(adm.onboardingStepsCompleted / adm.totalOnboardingSteps) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {adm.registrationStatus !== 'Enrolled' ? (
                      <PermissionGuard permission="admissions.convert_student">
                        <button
                          onClick={() => setSelectedOfferToConvert(adm)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          Convert to Student
                        </button>
                      </PermissionGuard>
                    ) : (
                      <span className="text-emerald-700 font-semibold text-xs flex items-center justify-end gap-1">
                        <Check className="w-3.5 h-3.5" /> Enrolled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Convert to Student Confirmation Modal */}
      {selectedOfferToConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Student Enrolment
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Finalizing registration for <strong>{selectedOfferToConvert.studentName}</strong>.
            </p>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Course:</span>
                <span className="font-semibold text-slate-800">{selectedOfferToConvert.course}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Duplicate Check:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Passed (No prior record)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Fee Status:</span>
                <span className="font-mono text-slate-800 font-semibold">
                  ₹{selectedOfferToConvert.feeAmount.toLocaleString()} Full Tuition
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              This action generates an official Student Registration Roll Number, provisions LMS credentials, and stops marketing drip sequences.
            </p>

            <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setSelectedOfferToConvert(null)}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmConvert}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
              >
                Confirm & Enroll Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AdmissionsEnrolmentPage as AdmissionsWidget };
export default AdmissionsEnrolmentPage;
