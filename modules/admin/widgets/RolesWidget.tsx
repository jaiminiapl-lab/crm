import React, { useState, useMemo } from 'react';
import { useCRM } from '../../../shared/services';
import { PermissionKey, UserRole, RoleDefinition } from '../../../shared/types';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Search,
  KeyRound,
  FileCheck,
  Users,
  Settings,
  Bot,
  Megaphone,
  Briefcase,
  AlertTriangle,
  Layers,
  Check,
  ArrowRight,
  Eye,
  EyeOff,
  DollarSign,
  Send,
  Zap,
  Plus,
  Trash2,
  Building2,
  Sparkles,
  X,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';

interface PermissionCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions: {
    key: PermissionKey;
    label: string;
    description: string;
  }[];
}

const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'leads',
    name: 'Leads & Pipeline Management',
    icon: Users,
    permissions: [
      {
        key: 'leads.view_all',
        label: 'View All Institutional Leads',
        description: 'Enables viewing leads across all counsellors, campuses, and courses.',
      },
      {
        key: 'leads.view_assigned_only',
        label: 'View Assigned Inquiries Only',
        description: 'Restricts counselor visibility to strictly their own assigned leads.',
      },
      {
        key: 'leads.view_pii',
        label: 'View Unmasked Student PII (Phone & Email)',
        description: 'Restricts unmasked student contact numbers and email addresses for DPDP compliance.',
      },
      {
        key: 'leads.create',
        label: 'Add New Inquiries / Leads',
        description: 'Permission to manually log prospective student inquiries.',
      },
      {
        key: 'leads.edit',
        label: 'Edit Lead Profiles & Academic Details',
        description: 'Modify contact numbers, qualifying percentages, and student preferences.',
      },
      {
        key: 'leads.delete',
        label: 'Delete / Purge Lead Records',
        description: 'Hard-delete student records from database (high-risk administrative privilege).',
      },
      {
        key: 'leads.export_csv',
        label: 'Export Student Records to CSV',
        description: 'Download PII student databases for offline analysis (monitored).',
      },
      {
        key: 'leads.bulk_assign',
        label: 'Execute Bulk Lead Re-Assignments',
        description: 'Re-distribute batches of leads across counselors based on quota.',
      },
      {
        key: 'pipeline.stage_change',
        label: 'Update Pipeline Funnel Stages',
        description: 'Drag & drop or update funnel stage transitions.',
      },
    ],
  },
  {
    id: 'admissions',
    name: 'Admissions Decisioning & Enrolment',
    icon: FileCheck,
    permissions: [
      {
        key: 'admissions.evaluate',
        label: 'Perform Academic Merit Evaluation',
        description: 'Assess applicant entrance percentiles and scholarship qualifications.',
      },
      {
        key: 'admissions.approve_offer',
        label: 'Approve Formal Admission Offer Letters',
        description: 'Final institutional sign-off for granting provisional or confirmed admission.',
      },
      {
        key: 'admissions.convert_student',
        label: 'Convert Applicant to Enrolled Student',
        description: 'Finalize tuition fee verification, generate roll number, and enroll into SIS.',
      },
      {
        key: 'admissions.reject',
        label: 'Reject Application / Place on Waitlist',
        description: 'Issue formal admissions rejection or waitlist notification.',
      },
      {
        key: 'admissions.view_financials',
        label: 'View Tuition Financials & Token Fees',
        description: 'Access sensitive fee collection totals, token amounts, and scholarship concessions.',
      },
      {
        key: 'documents.verify',
        label: 'Approve & Verify KYC / Academic Documents',
        description: 'Mark uploaded 10th/12th/degree marksheets and identity proofs as Verified.',
      },
      {
        key: 'documents.reject',
        label: 'Reject Uploaded Documents with Reason',
        description: 'Flag forged, unreadable, or missing certificates for re-upload.',
      },
    ],
  },
  {
    id: 'counselling',
    name: 'Counselling Sessions & Follow-Up Tasks',
    icon: Briefcase,
    permissions: [
      {
        key: 'counselling.book',
        label: 'Schedule 1-on-1 Counselling Sessions',
        description: 'Book Google Meet or campus walk-in appointments for candidates.',
      },
      {
        key: 'counselling.mark_attendance',
        label: 'Mark Session Attendance & Log Notes',
        description: 'Record meeting outcomes, parent demeanor, and conversion probability.',
      },
      {
        key: 'tasks.manage',
        label: 'Create & Complete Follow-Up Tasks',
        description: 'Manage daily call reminders, document collection tasks, and follow-ups.',
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Communications, Campaigns & WhatsApp',
    icon: Megaphone,
    permissions: [
      {
        key: 'communication.send_direct',
        label: 'Send Direct Messages (Email, SMS)',
        description: 'Trigger 1-on-1 messages to student phone numbers and emails.',
      },
      {
        key: 'communication.send_whatsapp',
        label: 'Dispatch WhatsApp HSM Templates & Blasts',
        description: 'Authorize WhatsApp API dispatches and transactional template notifications.',
      },
      {
        key: 'communication.manage_templates',
        label: 'Create & Edit WhatsApp/Email Templates',
        description: 'Submit HSM templates to Meta for approval and manage institution blurbs.',
      },
      {
        key: 'campaigns.manage',
        label: 'Create & Optimize Marketing Campaigns',
        description: 'Manage budgets, UTM attribution parameters, and advertising sources.',
      },
      {
        key: 'nurturing.manage',
        label: 'Configure Drip Nurturing Sequences',
        description: 'Design automated 7-step lead nurturing drip sequences.',
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI Intelligence & Workflow Automations',
    icon: Bot,
    permissions: [
      {
        key: 'ai.assistant',
        label: 'Use AI Co-Pilot & Response Generator',
        description: 'Access Gemini-driven counsel suggestions, transcript summaries, and drafts.',
      },
      {
        key: 'ai.configure_scoring',
        label: 'Configure AI Predictive Lead Scoring Weights',
        description: 'Calibrate academic vs engagement scoring weight parameters.',
      },
      {
        key: 'workflows.manage',
        label: 'Build Custom Trigger-Action Workflows',
        description: 'Define automation rules for lead routing and SLA escalations.',
      },
    ],
  },
  {
    id: 'admin',
    name: 'Institutional Governance & Integrations',
    icon: Settings,
    permissions: [
      {
        key: 'integrations.manage',
        label: 'Configure Third-Party APIs (Meta, WhatsApp, Google)',
        description: 'Connect advertising accounts, webhooks, and third-party CRM syncs.',
      },
      {
        key: 'integrations.dispatch_api',
        label: 'Trigger Real-Time API Sync & Webhook Replays',
        description: 'Authorize live external sync calls, ping verification tests, and webhook replays.',
      },
      {
        key: 'users.manage',
        label: 'Manage Counsellors & Staff Accounts',
        description: 'Create counselor logins, set quotas, and deactivate employee accounts.',
      },
      {
        key: 'roles.manage',
        label: 'Modify Institutional RBAC Permissions Matrix',
        description: 'Grant or revoke permissions across institutional roles.',
      },
      {
        key: 'settings.manage',
        label: 'Update Institutional Global Settings',
        description: 'Configure academic years, fee structures, and campus definitions.',
      },
      {
        key: 'audit.view',
        label: 'View Security & Activity Audit Trails',
        description: 'Inspect immutable logs of student records accessed, exported, and edited.',
      },
      {
        key: 'audit.export',
        label: 'Export Compliance Audit Logs',
        description: 'Download signed audit trails for regulatory compliance.',
      },
    ],
  },
];

export const RolesPermissionsPage: React.FC = () => {
  const {
    roles,
    currentUserRole,
    currentUserRoles,
    setCurrentUserRoles,
    toggleCurrentUserRole,
    effectivePermissions,
    hasPermission,
    togglePermissionForRole,
    resetRolesToDefault,
    addNewRole,
    deleteCustomRole,
    addToast,
    auditLogs,
  } = useCRM();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [simulatorAction, setSimulatorAction] = useState<PermissionKey>('leads.export_csv');
  const [roleDepartmentFilter, setRoleDepartmentFilter] = useState<string>('all');

  // Add Role Modal State
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRoleId, setNewRoleId] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDepartment, setNewRoleDepartment] = useState('Human Resources');
  const [customDepartmentText, setCustomDepartmentText] = useState('');
  const [newRoleTagline, setNewRoleTagline] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRoleColorTheme, setNewRoleColorTheme] = useState<'amber' | 'teal' | 'rose' | 'indigo' | 'purple' | 'blue' | 'emerald' | 'slate'>('amber');
  const [newRolePermissions, setNewRolePermissions] = useState<PermissionKey[]>([
    'users.manage',
    'tasks.manage',
    'audit.view',
    'ai.assistant',
  ]);
  const [modalPermSearch, setModalPermSearch] = useState('');

  // Delete Role Confirmation Modal State
  const [roleToDelete, setRoleToDelete] = useState<RoleDefinition | null>(null);

  // Interactive Multi-Role Synthesizer Sandbox State
  const [synthRoles, setSynthRoles] = useState<UserRole[]>(['Admissions Counsellor', 'CRM Manager']);

  const handleToggleSynthRole = (r: UserRole) => {
    setSynthRoles((prev) => {
      if (prev.includes(r)) {
        if (prev.length <= 1) return prev;
        return prev.filter((item) => item !== r);
      }
      return [...prev, r];
    });
  };

  const synthesizedPermissions = useMemo<PermissionKey[]>(() => {
    const set = new Set<PermissionKey>();
    synthRoles.forEach((roleId) => {
      const def = roles.find((r) => r.id === roleId);
      if (def) {
        def.permissions.forEach((p) => set.add(p));
      }
    });
    return Array.from(set);
  }, [synthRoles, roles]);

  const handleApplySynthToActiveSession = () => {
    setCurrentUserRoles(synthRoles);
    addToast({
      title: 'Multi-Role Session Activated',
      message: `Active session updated to [${synthRoles.join(' + ')}]. Effective permissions recalculated.`,
      type: 'success',
    });
  };

  const allAvailablePermissions = useMemo(() => {
    return PERMISSION_CATEGORIES.flatMap((c) => c.permissions.map((p) => p.key));
  }, []);

  const totalMatrixPermissions = PERMISSION_CATEGORIES.reduce(
    (acc, c) => acc + c.permissions.length,
    0
  );

  const filteredCategories = PERMISSION_CATEGORIES.map((cat) => ({
    ...cat,
    permissions: cat.permissions.filter(
      (p) =>
        (selectedCategory === 'all' || selectedCategory === cat.id) &&
        (p.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
          p.key.toLowerCase().includes(searchFilter.toLowerCase()) ||
          p.description.toLowerCase().includes(searchFilter.toLowerCase()))
    ),
  })).filter((cat) => cat.permissions.length > 0);

  const distinctDepartments = useMemo(() => {
    const set = new Set<string>();
    roles.forEach((r) => {
      if (r.department) set.add(r.department);
    });
    return ['all', ...Array.from(set)];
  }, [roles]);

  const displayedRoles = useMemo(() => {
    if (roleDepartmentFilter === 'all') return roles;
    return roles.filter((r) => r.department === roleDepartmentFilter);
  }, [roles, roleDepartmentFilter]);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(roles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `iapl-lms-rbac-matrix-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast({
      title: 'Security Policy Exported',
      message: 'Downloaded complete JSON specification of institutional roles and permissions.',
      type: 'success',
    });
  };

  const isSimulatedActionAllowed = hasPermission(simulatorAction);

  // Badge theme presets
  const BADGE_COLOR_MAP: Record<string, { label: string; badgeClass: string; barClass: string }> = {
    amber: { label: 'Amber (HR)', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200', barClass: 'bg-amber-500' },
    teal: { label: 'Teal (Operations)', badgeClass: 'bg-teal-100 text-teal-800 border-teal-200', barClass: 'bg-teal-600' },
    rose: { label: 'Rose (Finance)', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200', barClass: 'bg-rose-600' },
    indigo: { label: 'Indigo (CRM/Marketing)', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200', barClass: 'bg-indigo-600' },
    purple: { label: 'Purple (Admin/IT)', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200', barClass: 'bg-purple-600' },
    blue: { label: 'Blue (Admissions)', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200', barClass: 'bg-blue-600' },
    emerald: { label: 'Emerald (Counselling)', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200', barClass: 'bg-emerald-600' },
    slate: { label: 'Slate (Compliance)', badgeClass: 'bg-slate-100 text-slate-800 border-slate-200', barClass: 'bg-slate-600' },
  };

  // Quick Role Templates
  const ROLE_TEMPLATES = [
    {
      title: 'HR & Talent Manager',
      dept: 'Human Resources',
      color: 'amber' as const,
      tagline: 'Staff recruitment, onboarding & capacity',
      desc: 'Oversees counsellor hiring, capacity quota, user onboarding, staff access audits, and internal task assignments.',
      perms: ['users.manage', 'tasks.manage', 'audit.view', 'ai.assistant'] as PermissionKey[],
    },
    {
      title: 'Campus Operations Manager',
      dept: 'Campus Operations',
      color: 'teal' as const,
      tagline: 'Walk-ins, tours, attendance & campus flows',
      desc: 'Coordinates physical campus open-day tours, in-person counselling attendance, and offline operational workflow rules.',
      perms: ['leads.view_all', 'counselling.book', 'counselling.mark_attendance', 'tasks.manage', 'workflows.manage', 'audit.view'] as PermissionKey[],
    },
    {
      title: 'Finance & Fee Accounts Officer',
      dept: 'Finance & Accounts',
      color: 'rose' as const,
      tagline: 'Tuition fees, receipts & registration sign-off',
      desc: 'Handles fee receipts, scholarship reconciliation, financial audit trails, and student enrolment clearance.',
      perms: ['admissions.view_financials', 'admissions.convert_student', 'leads.export_csv', 'audit.view'] as PermissionKey[],
    },
    {
      title: 'Dean / Academic Program Head',
      dept: 'Academic Affairs',
      color: 'indigo' as const,
      tagline: 'Candidate interviews & academic offer evaluation',
      desc: 'Participates in admissions evaluation panels, interviews candidates, and issues conditional admission endorsements.',
      perms: ['leads.view_all', 'admissions.evaluate', 'admissions.approve_offer', 'counselling.book', 'tasks.manage', 'audit.view'] as PermissionKey[],
    },
    {
      title: 'Compliance & Audit Inspector',
      dept: 'Legal & Compliance',
      color: 'slate' as const,
      tagline: 'DPDP compliance & audit trail inspection',
      desc: 'Monitors adherence to student privacy regulations, inspects unmasked access logs, and exports compliance certificates.',
      perms: ['audit.view', 'audit.export', 'leads.view_all'] as PermissionKey[],
    },
    {
      title: 'Full Governance Authority',
      dept: 'Institutional Governance',
      color: 'purple' as const,
      tagline: 'Unrestricted institutional privileges across all modules',
      desc: 'Grants comprehensive access to pipeline, admissions, marketing, automation, and API integrations.',
      perms: allAvailablePermissions,
    },
  ];

  const handleApplyTemplate = (tmpl: typeof ROLE_TEMPLATES[0]) => {
    setNewRoleId(tmpl.title);
    setNewRoleName(tmpl.title);
    setNewRoleDepartment(tmpl.dept);
    setNewRoleTagline(tmpl.tagline);
    setNewRoleDescription(tmpl.desc);
    setNewRoleColorTheme(tmpl.color);
    setNewRolePermissions([...tmpl.perms]);
  };

  const handleToggleNewRolePermission = (perm: PermissionKey) => {
    setNewRolePermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleToggleCategoryPermissions = (categoryPerms: PermissionKey[]) => {
    const allPresent = categoryPerms.every((p) => newRolePermissions.includes(p));
    if (allPresent) {
      setNewRolePermissions((prev) => prev.filter((p) => !categoryPerms.includes(p)));
    } else {
      setNewRolePermissions((prev) => Array.from(new Set([...prev, ...categoryPerms])));
    }
  };

  const handleCreateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDept = newRoleDepartment === 'Other' ? customDepartmentText.trim() || 'General Operations' : newRoleDepartment;
    const finalId = newRoleId.trim();
    if (!finalId) {
      addToast({
        title: 'Role Identifier Missing',
        message: 'Please provide a unique role title.',
        type: 'error',
      });
      return;
    }

    if (newRolePermissions.length === 0) {
      addToast({
        title: 'No Permissions Selected',
        message: 'Please assign at least one permission capability to this new role.',
        type: 'warning',
      });
      return;
    }

    const badgeClass = BADGE_COLOR_MAP[newRoleColorTheme]?.badgeClass || 'bg-slate-100 text-slate-800 border-slate-200';

    const success = addNewRole({
      id: finalId,
      name: newRoleName.trim() || finalId,
      tagline: newRoleTagline.trim() || `${finalDept} departmental role`,
      description: newRoleDescription.trim() || `Departmental role configured for ${finalDept}.`,
      department: finalDept,
      badgeClass,
      isCustom: true,
      permissions: newRolePermissions,
    });

    if (success) {
      setIsAddRoleOpen(false);
      // Auto-select in synthesizer
      setSynthRoles((prev) => [...prev, finalId]);
    }
  };

  const handleConfirmDelete = () => {
    if (!roleToDelete) return;
    deleteCustomRole(roleToDelete.id);
    setRoleToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Institutional Roles & Fine-Grained Permissions
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  {roles.length} Roles Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic departmental roles (HR, Operations, Finance & Accounts), additive multi-role union, and button-level gating.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Action: Add New Role */}
          <button
            onClick={() => {
              setIsAddRoleOpen(true);
              setNewRoleId('');
              setNewRoleName('');
              setNewRoleTagline('');
              setNewRoleDescription('');
              setNewRoleDepartment('Human Resources');
              setCustomDepartmentText('');
              setNewRoleColorTheme('amber');
              setNewRolePermissions(['users.manage', 'tasks.manage', 'audit.view', 'ai.assistant']);
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add New Role
          </button>

          <button
            onClick={resetRolesToDefault}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            title="Restore baseline security policy"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Defaults
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Matrix (JSON)
          </button>
        </div>
      </div>

      {/* Department Tabs for Role Cards */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" /> Filter Department:
          </span>
          {distinctDepartments.map((dept) => (
            <button
              key={dept}
              onClick={() => setRoleDepartmentFilter(dept)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
                roleDepartmentFilter === dept
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {dept === 'all' ? `All Departments (${roles.length})` : dept}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          Click any card to add/remove role from your active session
        </span>
      </div>

      {/* Institutional Role Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedRoles.map((r) => {
          const isRoleActiveInSession = currentUserRoles.includes(r.id);
          const totalPermCount = r.permissions.length;
          const maxPerms = totalMatrixPermissions;
          const percentGranted = Math.round((totalPermCount / maxPerms) * 100);

          return (
            <div
              key={r.id}
              onClick={() => toggleCurrentUserRole(r.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative group flex flex-col justify-between ${
                isRoleActiveInSession
                  ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded border ${r.badgeClass}`}
                      >
                        {r.id}
                      </span>
                      {r.isCustom && (
                        <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                          Custom Role
                        </span>
                      )}
                    </div>
                    {r.department && (
                      <span className="text-[10px] font-medium text-slate-500">
                        {r.department}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {r.isCustom && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRoleToDelete(r);
                        }}
                        className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title={`Delete custom role "${r.name}"`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isRoleActiveInSession ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 stroke-[3]" /> Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 group-hover:text-blue-600 font-medium">
                        + Add
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2.5">{r.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-4 min-h-[32px]">
                  {r.description}
                </p>
              </div>

              <div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <strong className="text-slate-700">{r.userCount}</strong> staff
                  </span>
                  <span className="font-mono text-slate-700 font-medium bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                    {totalPermCount}/{maxPerms} ({percentGranted}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      r.badgeClass.includes('purple')
                        ? 'bg-purple-600'
                        : r.badgeClass.includes('blue')
                        ? 'bg-blue-600'
                        : r.badgeClass.includes('amber')
                        ? 'bg-amber-500'
                        : r.badgeClass.includes('teal')
                        ? 'bg-teal-600'
                        : r.badgeClass.includes('rose')
                        ? 'bg-rose-600'
                        : r.badgeClass.includes('indigo')
                        ? 'bg-indigo-600'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${percentGranted}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Role Permission Synthesizer & Simulator */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-700 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase text-amber-300">
                Multi-Role Synthesizer & Access Simulator
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Select multiple roles to inspect additive permissions, unmasked data fields, and button access.
              </p>
            </div>
          </div>

          {/* Quick Apply Button */}
          <button
            onClick={handleApplySynthToActiveSession}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 self-start lg:self-auto shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            Apply This Combination to Active Session
          </button>
        </div>

        {/* Role Toggle Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Synthesize Roles:</span>
          {roles.map((r) => {
            const isChecked = synthRoles.includes(r.id);
            return (
              <button
                key={r.id}
                onClick={() => handleToggleSynthRole(r.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isChecked
                    ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                    isChecked ? 'border-white bg-white/20' : 'border-slate-500'
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span>{r.id}</span>
              </button>
            );
          })}
        </div>

        {/* Live Synthesizer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs">
          {/* Card 1: Effective Privileges */}
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg space-y-1">
            <span className="text-slate-400 text-[11px] block">Additive Permissions Union</span>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {synthesizedPermissions.length} / {totalMatrixPermissions}
            </div>
            <span className="text-[10px] text-slate-400">
              Combined from {synthRoles.length} roles without conflicts
            </span>
          </div>

          {/* Card 2: Student PII Contact Info */}
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg space-y-1">
            <span className="text-slate-400 text-[11px] block">Student PII Contact Access</span>
            <div className="flex items-center gap-1.5">
              {synthesizedPermissions.includes('leads.view_pii') ? (
                <>
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-400">Unmasked & Searchable</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-400">Masked (+91 98***)</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              {synthesizedPermissions.includes('leads.view_pii')
                ? 'Authorized for phone & email'
                : 'Restricted by DPDP compliance'}
            </span>
          </div>

          {/* Card 3: Financial & Concessions */}
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg space-y-1">
            <span className="text-slate-400 text-[11px] block">Tuition Financials Access</span>
            <div className="flex items-center gap-1.5">
              {synthesizedPermissions.includes('admissions.view_financials') ? (
                <>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-400">Full Fee Figures</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  <span className="font-bold text-slate-400">Masked (₹••••••)</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              {synthesizedPermissions.includes('admissions.view_financials')
                ? 'Tokens, revenue & concessions open'
                : 'Requires admissions.view_financials'}
            </span>
          </div>

          {/* Card 4: API & Webhook Dispatches */}
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg space-y-1">
            <span className="text-slate-400 text-[11px] block">API Syncs & Replays</span>
            <div className="flex items-center gap-1.5">
              {synthesizedPermissions.includes('integrations.dispatch_api') ? (
                <>
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-400">200 OK (Allowed)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="font-bold text-rose-400">403 Forbidden Error</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              {synthesizedPermissions.includes('integrations.dispatch_api')
                ? 'Direct integration execution active'
                : 'API requests rejected with 403 error'}
            </span>
          </div>
        </div>

        {/* Live Single Action Tester Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-medium">Test Specific API / Button Action:</span>
            <select
              value={simulatorAction}
              onChange={(e) => setSimulatorAction(e.target.value as PermissionKey)}
              aria-label="Select Target Action for Simulation"
              className="bg-slate-800 text-white text-xs border border-slate-600 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-amber-400 font-medium"
            >
              <option value="leads.export_csv">Export Leads CSV Database (leads.export_csv)</option>
              <option value="leads.view_pii">View Student Phone & Email (leads.view_pii)</option>
              <option value="leads.bulk_assign">Bulk Assign Leads (leads.bulk_assign)</option>
              <option value="admissions.approve_offer">Approve Admission Offer (admissions.approve_offer)</option>
              <option value="admissions.view_financials">View Tuition Financials (admissions.view_financials)</option>
              <option value="admissions.convert_student">Convert to Enrolled Student (admissions.convert_student)</option>
              <option value="communication.send_whatsapp">Send WhatsApp HSM Blasts (communication.send_whatsapp)</option>
              <option value="integrations.dispatch_api">Trigger Live API Sync / Replay (integrations.dispatch_api)</option>
              <option value="documents.verify">Verify KYC/Degree Documents (documents.verify)</option>
              <option value="integrations.manage">Configure Meta/WhatsApp APIs (integrations.manage)</option>
              <option value="ai.configure_scoring">Calibrate AI Lead Scoring (ai.configure_scoring)</option>
              <option value="roles.manage">Modify RBAC Permissions Matrix (roles.manage)</option>
              <option value="leads.delete">Purge Student Records (leads.delete)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 shrink-0">
            <span className="text-xs text-slate-400">Simulation Status:</span>
            {isSimulatedActionAllowed ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Authorized
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700">
                <XCircle className="w-3.5 h-3.5 text-rose-400" /> 403 Forbidden
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Matrix */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search permissions by keyword or capability key..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 whitespace-nowrap mr-1">Filter Domain:</span>
          {['all', 'leads', 'admissions', 'counselling', 'marketing', 'ai', 'admin'].map((catId) => (
            <button
              key={catId}
              onClick={() => setSelectedCategory(catId)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedCategory === catId
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {catId === 'all' ? `All (${totalMatrixPermissions})` : catId.charAt(0).toUpperCase() + catId.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Granular Permissions Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-5/12">Permission & Security Scope</th>
                {roles.map((r) => {
                  const isRoleActive = currentUserRoles.includes(r.id);
                  return (
                    <th
                      key={r.id}
                      className={`py-3.5 px-3 text-center min-w-[130px] ${
                        isRoleActive ? 'bg-blue-50/60 text-blue-900 border-x border-blue-200' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-xs">{r.id}</span>
                          {r.isCustom && (
                            <button
                              type="button"
                              onClick={() => setRoleToDelete(r)}
                              className="text-slate-300 hover:text-rose-600 transition-colors"
                              title={`Delete ${r.name}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {r.department || 'Operations'}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 font-medium">
                          {r.permissions.length} perms
                        </span>
                        {isRoleActive && (
                          <span className="mt-1 text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredCategories.map((category) => (
                <React.Fragment key={category.id}>
                  {/* Category Header Row */}
                  <tr className="bg-slate-100/70 border-y border-slate-200">
                    <td colSpan={1 + roles.length} className="py-2 px-4 font-bold text-slate-700 flex items-center gap-2">
                      <category.icon className="w-4 h-4 text-slate-500" />
                      <span>{category.name}</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        ({category.permissions.length} capabilities)
                      </span>
                    </td>
                  </tr>

                  {/* Permission Rows */}
                  {category.permissions.map((perm) => (
                    <tr key={perm.key} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 align-top">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-xs">{perm.label}</span>
                          <span className="text-[11px] text-slate-500 mt-0.5">{perm.description}</span>
                          <span className="font-mono text-[10px] text-slate-400 mt-1 select-all">
                            {perm.key}
                          </span>
                        </div>
                      </td>

                      {roles.map((r) => {
                        const hasPerm = r.permissions.includes(perm.key);
                        const isSuperAdmin = r.id === 'Super Admin';
                        const isSelfActive = currentUserRoles.includes(r.id);

                        return (
                          <td
                            key={r.id}
                            className={`py-3 px-3 text-center align-middle ${
                              isSelfActive ? 'bg-blue-50/30 border-x border-blue-100' : ''
                            }`}
                          >
                            <label className="inline-flex items-center justify-center cursor-pointer p-1 rounded hover:bg-slate-100">
                              <input
                                type="checkbox"
                                checked={hasPerm}
                                disabled={isSuperAdmin && perm.key === 'roles.manage'}
                                onChange={() => togglePermissionForRole(r.id, perm.key)}
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              />
                            </label>
                            <div className="mt-0.5">
                              {hasPerm ? (
                                <span className="text-[10px] text-emerald-600 font-medium">Granted</span>
                              ) : (
                                <span className="text-[10px] text-slate-400">Revoked</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Trail for Role Changes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">Security & RBAC Audit Event Stream</h3>
          </div>
          <span className="text-xs text-slate-400">Live system events logged with immutable timestamp</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {auditLogs
            .filter((log) => log.entity === 'Security & RBAC' || log.action === 'Permission Change' || log.action === 'Security Policy Reset' || log.entity === 'Setting' || log.action === 'Role Created' || log.action === 'Role Deleted')
            .slice(0, 5)
            .map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                    {log.action}
                  </span>
                  <span className="text-slate-800 font-medium">{log.details}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 shrink-0 text-[11px]">
                  <span>{log.userName}</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* CREATE NEW INSTITUTIONAL ROLE MODAL */}
      {isAddRoleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Create New Institutional Role
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Define custom departmental authorities (HR, Operations, Finance, etc.) with granular permission boundaries.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddRoleOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleCreateRoleSubmit} id="create-role-form" className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Template Quick-Select Bar */}
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-900 text-xs">
                    Quick-Start Department Templates (1-Click Fill)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ROLE_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.title}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="p-2 text-left rounded-lg bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all shadow-2xs group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-[11px] group-hover:text-blue-700 truncate">
                          {tmpl.title}
                        </span>
                        <span className="text-[10px] text-blue-600 font-mono font-medium">
                          {tmpl.perms.length} perms
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {tmpl.dept}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Role Identifier / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoleId}
                    onChange={(e) => {
                      setNewRoleId(e.target.value);
                      if (!newRoleName) setNewRoleName(e.target.value);
                    }}
                    placeholder="e.g. HR & Talent Manager"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Unique key used in headers, users, and audit records
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Department Classification *
                  </label>
                  <select
                    value={newRoleDepartment}
                    onChange={(e) => setNewRoleDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-blue-500 bg-white"
                  >
                    <option value="Human Resources">Human Resources (HR)</option>
                    <option value="Campus Operations">Campus Operations & Logistics</option>
                    <option value="Finance & Accounts">Finance & Fee Accounts</option>
                    <option value="Admissions & Administration">Admissions & Administration</option>
                    <option value="Academic Affairs">Academic Affairs & Faculty</option>
                    <option value="Examinations & Student Records">Examinations & Records</option>
                    <option value="Student Welfare & Hostels">Student Welfare & Hostels</option>
                    <option value="Corporate Relations & Placements">Corporate Placements</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                    <option value="Other">Other (Custom Department...)</option>
                  </select>
                </div>

                {newRoleDepartment === 'Other' && (
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Enter Custom Department Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customDepartmentText}
                      onChange={(e) => setCustomDepartmentText(e.target.value)}
                      placeholder="e.g. Sports & Physical Education"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Role Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={newRoleTagline}
                    onChange={(e) => setNewRoleTagline(e.target.value)}
                    placeholder="e.g. Staff recruitment, faculty onboarding & team capacity"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Institutional Role Description
                  </label>
                  <textarea
                    rows={2}
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="Describe the institutional responsibilities, oversight level, and DPDP boundaries of this role..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Badge Theme Color Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Badge Color Styling
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {(Object.keys(BADGE_COLOR_MAP) as Array<keyof typeof BADGE_COLOR_MAP>).map((key) => {
                    const item = BADGE_COLOR_MAP[key];
                    const isSelected = newRoleColorTheme === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setNewRoleColorTheme(key as any)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'ring-2 ring-blue-500 shadow-xs'
                            : 'opacity-70 hover:opacity-100'
                        } ${item.badgeClass}`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Live Badge Preview:</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      BADGE_COLOR_MAP[newRoleColorTheme]?.badgeClass
                    }`}
                  >
                    {newRoleId || 'Role Identifier'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    • {newRoleDepartment === 'Other' ? (customDepartmentText || 'Custom Department') : newRoleDepartment}
                  </span>
                </div>
              </div>

              {/* Granular Permissions Section */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Grant Fine-Grained Permissions
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Select which capabilities this departmental role is authorized to execute.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-mono font-bold bg-blue-100 text-blue-800 rounded-md">
                      {newRolePermissions.length} of {totalMatrixPermissions} Selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewRolePermissions(allAvailablePermissions)}
                      className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRolePermissions([])}
                      className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Permission Search Inside Modal */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={modalPermSearch}
                    onChange={(e) => setModalPermSearch(e.target.value)}
                    placeholder="Search capabilities by name, module, or key..."
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* Categories Accordions / Checklists */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {PERMISSION_CATEGORIES.map((cat) => {
                    const matchedPerms = cat.permissions.filter(
                      (p) =>
                        p.label.toLowerCase().includes(modalPermSearch.toLowerCase()) ||
                        p.key.toLowerCase().includes(modalPermSearch.toLowerCase()) ||
                        p.description.toLowerCase().includes(modalPermSearch.toLowerCase())
                    );
                    if (matchedPerms.length === 0) return null;

                    const catKeys = cat.permissions.map((p) => p.key);
                    const selectedInCat = catKeys.filter((k) => newRolePermissions.includes(k)).length;
                    const isAllCatSelected = selectedInCat === catKeys.length;

                    return (
                      <div
                        key={cat.id}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                      >
                        {/* Category Header */}
                        <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <cat.icon className="w-4 h-4 text-slate-600" />
                            <span className="font-bold text-slate-800 text-xs">{cat.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ({selectedInCat}/{cat.permissions.length})
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleCategoryPermissions(catKeys)}
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 px-2 py-0.5 rounded hover:bg-blue-50 transition-colors"
                          >
                            {isAllCatSelected ? 'Deselect Category' : 'Select Category'}
                          </button>
                        </div>

                        {/* Category Permissions Grid */}
                        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matchedPerms.map((perm) => {
                            const isChecked = newRolePermissions.includes(perm.key);
                            return (
                              <label
                                key={perm.key}
                                className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                                  isChecked
                                    ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-500/20'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleNewRolePermission(perm.key)}
                                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0"
                                />
                                <div>
                                  <span className="font-semibold text-slate-900 block leading-tight">
                                    {perm.label}
                                  </span>
                                  <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">
                                    {perm.description}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400 block mt-1">
                                    {perm.key}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Total Capabilities Granted: <strong className="text-slate-800">{newRolePermissions.length}</strong>
                </span>
                {newRolePermissions.length === 0 && (
                  <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Please select at least 1 permission
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRoleOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="create-role-form"
                  disabled={!newRoleId.trim() || newRolePermissions.length === 0}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Create Role & Register in Matrix
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE ROLE MODAL */}
      {roleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Delete Institutional Role?
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Are you sure you want to delete the custom role <strong className="text-slate-900">"{roleToDelete.name}"</strong> ({roleToDelete.department || 'Operations'})?
            </p>
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs space-y-1">
              <p className="font-semibold">Consequences of deletion:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-rose-800">
                <li>This role will be permanently removed from the RBAC Permissions Matrix.</li>
                <li>Any staff counsellors or active user sessions using this role will be updated immediately.</li>
                <li>This action is logged in immutable compliance audit logs.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setRoleToDelete(null)}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                Delete Custom Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { RolesPermissionsPage as RolesWidget };
export default RolesPermissionsPage;
