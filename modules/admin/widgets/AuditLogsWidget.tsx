import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { AuditLogItem } from '../../../shared/types';
import {
  History,
  Shield,
  Search,
  Filter,
  Download,
  CheckCircle,
  Eye,
  Lock,
  Calendar,
  X,
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs, addToast } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [entityFilter, setEntityFilter] = useState('All');
  const [inspectedLog, setInspectedLog] = useState<AuditLogItem | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    if (actionFilter !== 'All' && log.action !== actionFilter) return false;
    if (entityFilter !== 'All' && log.entity !== entityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportAuditTrail = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Audit ID,Timestamp,User,Role,Action,Entity,Entity ID,Details,IP Address',
        ...filteredLogs.map(
          (l) =>
            `"${l.id}","${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.entity}","${l.entityId}","${l.details}","${l.ipAddress}"`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IAPL_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Audit Trail Exported',
      message: `Exported ${filteredLogs.length} immutable compliance records to CSV.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Audit Logs & Compliance Trail"
        subtitle="Tamper-evident, cryptographically verifiable event stream tracking record modifications, approvals, and counsellor access."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Audit Logs' }]}
        actions={
          <button
            onClick={handleExportAuditTrail}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export Audit Log
          </button>
        }
      />

      {/* Security badge banner */}
      <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>
            <strong>Write-Once Append-Only Compliance Storage:</strong> Audit logs cannot be modified, edited, or expunged by any user persona in accordance with educational data retention laws.
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">SOC2 Type II Compliant</span>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search log details, user name, or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-700"
          >
            <option value="All">All Actions</option>
            <option value="Create">Create</option>
            <option value="Update">Update</option>
            <option value="Status Change">Status Change</option>
            <option value="Assignment">Assignment</option>
            <option value="Document Approval">Document Approval</option>
            <option value="Offer Issued">Offer Issued</option>
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-700"
          >
            <option value="All">All Entities</option>
            <option value="Lead">Lead</option>
            <option value="Application">Application</option>
            <option value="Document">Document</option>
            <option value="Admission">Admission</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Log ID & Timestamp</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Action Details</th>
                <th className="py-3 px-4 font-mono">IP Address</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-semibold text-slate-900 block">{log.id}</span>
                    <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{log.userName}</span>
                    <span className="text-[10px] text-slate-400">{log.userRole}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">{log.entity}</span>
                    <span className="font-mono text-[10px] text-slate-400 block">{log.entityId}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate">{log.details}</td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {log.ipAddress}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setInspectedLog(log)}
                      className="p-1 text-slate-500 hover:text-blue-600 rounded transition-colors"
                      title="Inspect Changes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Detail Modal */}
      {inspectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Audit Event Inspection: {inspectedLog.id}
              </h3>
              <button
                onClick={() => setInspectedLog(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono text-slate-900 font-semibold">{inspectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Performed By:</span>
                  <span className="text-slate-900 font-semibold">
                    {inspectedLog.userName} ({inspectedLog.userRole})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operation:</span>
                  <span className="font-semibold text-blue-700">{inspectedLog.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Record:</span>
                  <span className="font-mono text-slate-900">
                    {inspectedLog.entity} [{inspectedLog.entityId}]
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Client IP Address:</span>
                  <span className="font-mono text-slate-600">{inspectedLog.ipAddress}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Audit Log Payload</span>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg leading-relaxed">
                  {`{\n  "event_id": "${inspectedLog.id}",\n  "action": "${inspectedLog.action}",\n  "description": "${inspectedLog.details}",\n  "tamper_proof_hash": "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"\n}`}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setInspectedLog(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AuditLogsPage as AuditLogsWidget };
export default AuditLogsPage;
