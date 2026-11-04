import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { Counsellor, UserRole } from '../../../shared/types';
import {
  UserPlus,
  Mail,
  Phone,
  Building,
  Shield,
  CheckCircle,
  MoreVertical,
  X,
  Layers,
  Check,
  UserCheck,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { PermissionGuard } from '../../../shared/components';

export const UsersCounsellorsPage: React.FC = () => {
  const {
    counsellors,
    roles,
    addToast,
    updateCounsellorRoles,
    currentUserRoles,
    setCurrentUserRoles,
  } = useCRM();

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('+91 98200 12345');
  const [inviteCampus, setInviteCampus] = useState('Mumbai Main Campus');
  const [inviteRoleTitle, setInviteRoleTitle] = useState<Counsellor['role']>('Admissions Counsellor');
  const [inviteAssignedRoles, setInviteAssignedRoles] = useState<UserRole[]>(['Admissions Counsellor']);

  // Edit Multi-Roles Modal State
  const [editingCounsellor, setEditingCounsellor] = useState<Counsellor | null>(null);
  const [selectedRolesToEdit, setSelectedRolesToEdit] = useState<UserRole[]>([]);

  const handleOpenEditRoles = (c: Counsellor) => {
    setEditingCounsellor(c);
    setSelectedRolesToEdit(c.assignedRoles || ['Admissions Counsellor']);
  };

  const handleToggleEditRole = (role: UserRole) => {
    setSelectedRolesToEdit((prev) => {
      if (prev.includes(role)) {
        if (prev.length <= 1) return prev; // Must have at least 1 role
        return prev.filter((r) => r !== role);
      }
      return [...prev, role];
    });
  };

  const handleSaveEditedRoles = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCounsellor || selectedRolesToEdit.length === 0) return;

    updateCounsellorRoles(editingCounsellor.id, selectedRolesToEdit);
    setEditingCounsellor(null);
  };

  const handleToggleInviteRole = (role: UserRole) => {
    setInviteAssignedRoles((prev) => {
      if (prev.includes(role)) {
        if (prev.length <= 1) return prev;
        return prev.filter((r) => r !== role);
      }
      return [...prev, role];
    });
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    setIsInviteOpen(false);
    addToast({
      title: 'Invitation Dispatched',
      message: `Staff invitation sent to ${inviteEmail} with multi-roles: [${inviteAssignedRoles.join(', ')}].`,
      type: 'success',
    });
    setInviteName('');
    setInviteEmail('');
    setInviteAssignedRoles(['Admissions Counsellor']);
  };

  const handleSwitchToCounsellorRoles = (c: Counsellor) => {
    const targetRoles = c.assignedRoles || ['Admissions Counsellor'];
    setCurrentUserRoles(targetRoles);
    addToast({
      title: `Active Persona Switched: ${c.name}`,
      message: `Testing session now reflects ${targetRoles.length} assigned role(s): [${targetRoles.join(' + ')}].`,
      type: 'info',
    });
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Head of Admissions':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'CRM Manager':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Admissions Counsellor':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Counsellors Management"
        subtitle="Manage staff rosters, multi-role assignments, fine-grained access policies, and counsellor workload quotas."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Users & Counsellors' }]}
        actions={
          <PermissionGuard permission="users.manage">
            <button
              onClick={() => setIsInviteOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" /> Invite Staff Member
            </button>
          </PermissionGuard>
        }
      />

      {/* Multi-Role Info Banner */}
      <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Multi-Role Architecture Enabled</h4>
            <p className="text-[11px] text-slate-600">
              Users can hold multiple institutional roles simultaneously. Permissions combine as an additive union, unlocking corresponding pages, buttons, and unmasking sensitive candidate data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <span className="text-[11px] font-semibold text-slate-700">Active Test Persona:</span>
          <div className="flex items-center gap-1">
            {currentUserRoles.map((r) => (
              <span
                key={r}
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRoleBadgeStyle(r)}`}
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Counsellor Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {counsellors.map((c) => {
          const utilPct = Math.round((c.assignedLeadsCount / c.maxCapacity) * 100);
          const assignedRoles = c.assignedRoles || ['Admissions Counsellor'];
          const isCurrentSession =
            assignedRoles.length === currentUserRoles.length &&
            assignedRoles.every((r) => currentUserRoles.includes(r));

          return (
            <div
              key={c.id}
              className={`p-5 bg-white border rounded-xl shadow-xs space-y-4 hover:border-slate-300 transition-all ${
                isCurrentSession ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">{c.name}</h3>
                      {isCurrentSession && (
                        <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-blue-600 font-medium">{c.role}</span>
                  </div>
                </div>

                <StatusBadge status={c.activeStatus} size="sm" />
              </div>

              {/* Assigned Roles Tag List */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-slate-400" /> Assigned Roles:
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {assignedRoles.length} {assignedRoles.length > 1 ? 'Roles' : 'Role'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {assignedRoles.map((role) => (
                    <span
                      key={role}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${getRoleBadgeStyle(
                        role
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.campus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.phone}</span>
                </div>
              </div>

              {/* Workload Capacity Meter */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Workload Quota</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {c.assignedLeadsCount} / {c.maxCapacity} ({utilPct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      utilPct >= 85 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(utilPct, 100)}%` }}
                  />
                </div>
              </div>

              {/* Performance numbers */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Conversions</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {c.achievedConversions} / {c.monthlyTarget}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Avg Response</span>
                  <span className="font-mono font-bold text-slate-800">
                    {c.averageResponseTime}
                  </span>
                </div>
              </div>

              {/* Card Actions: Edit Roles & Impersonate */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <PermissionGuard permission="roles.manage">
                  <button
                    onClick={() => handleOpenEditRoles(c)}
                    className="flex-1 py-1.5 px-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    Edit Multi-Roles
                  </button>
                </PermissionGuard>

                <button
                  onClick={() => handleSwitchToCounsellorRoles(c)}
                  className="py-1.5 px-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors flex items-center gap-1"
                  title="Test active UI as this staff member's combined roles"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  Test Persona
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Multi-Roles Modal */}
      {editingCounsellor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Configure Assigned Roles
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingCounsellor.name} ({editingCounsellor.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingCounsellor(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedRoles} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Select Roles (Multi-Role Assignment)
                </label>
                <p className="text-[11px] text-slate-500 mb-3">
                  Check all institutional roles that apply to this staff member. The user will automatically inherit the union of permissions from each checked role.
                </p>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {roles.map((r) => {
                    const isChecked = selectedRolesToEdit.includes(r.id);
                    return (
                      <div
                        key={r.id}
                        onClick={() => handleToggleEditRole(r.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isChecked
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 block">{r.id}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                                {r.department || 'Operations'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 line-clamp-1">
                              {r.description}
                            </span>
                          </div>
                        </div>
                        {isChecked && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full shrink-0 ml-2">
                            Assigned
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed">
                <strong>Audit Compliance Notice:</strong> Assigning multiple roles immediately recalculates effective permissions and updates access logs under Indian Digital Personal Data Protection Act compliance.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCounsellor(null)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-xs"
                >
                  Save Role Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">Invite Admissions Staff Member</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Send access credentials with pre-configured institutional roles.
            </p>

            <form onSubmit={handleInviteUser} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@iapl-lms.edu"
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Assigned Campus</label>
                <select
                  value={inviteCampus}
                  onChange={(e) => setInviteCampus(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Mumbai Main Campus">Mumbai Main Campus</option>
                  <option value="Bengaluru Tech Campus">Bengaluru Tech Campus</option>
                  <option value="Delhi NCR Campus">Delhi NCR Campus</option>
                  <option value="Pune Innovation Hub">Pune Innovation Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5">
                  Assigned Multi-Roles *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {roles.map((r) => {
                    const isChecked = inviteAssignedRoles.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleToggleInviteRole(r.id)}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 ${
                          isChecked
                            ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div className="truncate">
                          <span className="truncate text-[11px] block">{r.id}</span>
                          <span className="text-[9px] text-slate-400 block">{r.department || 'Operations'}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { UsersCounsellorsPage as UsersWidget };
export default UsersCounsellorsPage;
