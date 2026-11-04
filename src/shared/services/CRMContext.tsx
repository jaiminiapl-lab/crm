import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  Lead,
  Task,
  Appointment,
  Application,
  DocumentRecord,
  AdmissionRecord,
  Campaign,
  CommunicationMessage,
  Counsellor,
  WorkflowRule,
  NurturingSequence,
  AuditLogItem,
  Course,
  LeadStatus,
  IntegrationServiceItem,
  MetaLeadForm,
  WhatsAppTemplateItem,
  WebhookEventLog,
  FieldMapping,
  PermissionKey,
  RoleDefinition,
} from '../types';
import { CurrencyCode } from '../constants/international';
import { formatInternationalCurrency } from '../utils/formatters';
import {
  INITIAL_LEADS,
  INITIAL_TASKS,
  INITIAL_APPOINTMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_ADMISSIONS,
  INITIAL_CAMPAIGNS,
  INITIAL_MESSAGES,
  INITIAL_WORKFLOWS,
  INITIAL_SEQUENCES,
  INITIAL_AUDIT_LOGS,
  INITIAL_COUNSELLORS,
  INITIAL_COURSES,
  INITIAL_INTEGRATIONS,
  INITIAL_META_FORMS,
  INITIAL_FIELD_MAPPINGS,
  INITIAL_WHATSAPP_TEMPLATES,
  INITIAL_WEBHOOK_LOGS,
  INITIAL_ROLES,
} from './mockData';

export type PageId =
  | 'dashboard'
  | 'leads'
  | 'lead-details'
  | 'pipeline'
  | 'assignment'
  | 'tasks'
  | 'counselling'
  | 'applications'
  | 'documents'
  | 'admissions'
  | 'campaigns'
  | 'communication'
  | 'ai-scoring'
  | 'ai-assistant'
  | 'nurturing'
  | 'conversion-prediction'
  | 'workflows'
  | 'recommendations'
  | 'reports'
  | 'users'
  | 'settings'
  | 'audit'
  | 'integrations'
  | 'roles'
  | 'goals';

export type UserRole = string;

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'lead' | 'task' | 'document' | 'payment';
  linkTo?: PageId;
}

interface CRMContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  selectedLeadId: string;
  setSelectedLeadId: (id: string) => void;
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  selectedDateRange: string;
  setSelectedDateRange: (range: string) => void;

  // International CRM Configuration
  currentCurrency: CurrencyCode;
  setCurrentCurrency: (currency: CurrencyCode) => void;
  currentTimezone: string;
  setCurrentTimezone: (timezone: string) => void;

  // Active Multi-Role State
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentUserRoles: UserRole[];
  setCurrentUserRoles: (roles: UserRole[]) => void;
  toggleCurrentUserRole: (role: UserRole) => void;
  effectivePermissions: PermissionKey[];

  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;

  // Data collections
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  documents: DocumentRecord[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentRecord[]>>;
  admissions: AdmissionRecord[];
  setAdmissions: React.Dispatch<React.SetStateAction<AdmissionRecord[]>>;
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  messages: CommunicationMessage[];
  setMessages: React.Dispatch<React.SetStateAction<CommunicationMessage[]>>;
  workflows: WorkflowRule[];
  setWorkflows: React.Dispatch<React.SetStateAction<WorkflowRule[]>>;
  sequences: NurturingSequence[];
  setSequences: React.Dispatch<React.SetStateAction<NurturingSequence[]>>;
  auditLogs: AuditLogItem[];
  counsellors: Counsellor[];
  setCounsellors: React.Dispatch<React.SetStateAction<Counsellor[]>>;
  updateCounsellorRoles: (counsellorId: string, newRoles: UserRole[]) => void;
  courses: Course[];

  // Third-party Integrations
  integrations: IntegrationServiceItem[];
  setIntegrations: React.Dispatch<React.SetStateAction<IntegrationServiceItem[]>>;
  metaForms: MetaLeadForm[];
  setMetaForms: React.Dispatch<React.SetStateAction<MetaLeadForm[]>>;
  whatsappTemplates: WhatsAppTemplateItem[];
  setWhatsappTemplates: React.Dispatch<React.SetStateAction<WhatsAppTemplateItem[]>>;
  webhookLogs: WebhookEventLog[];
  setWebhookLogs: React.Dispatch<React.SetStateAction<WebhookEventLog[]>>;
  fieldMappings: FieldMapping[];
  setFieldMappings: React.Dispatch<React.SetStateAction<FieldMapping[]>>;

  // Integration Actions
  toggleIntegrationConnection: (id: string) => void;
  syncIntegrationNow: (id: string) => void;
  testIntegrationConnection: (id: string) => void;
  retryWebhook: (logId: string) => void;
  updateFieldMapping: (mappingId: string, newTarget: string) => void;
  simulateInboundLead: (provider: string) => void;

  // Notification & Toasts
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'notesCount' | 'tasksCount' | 'applicationsCount'>) => void;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  assignLead: (leadId: string, counsellorId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  verifyDocument: (docId: string, verified: boolean, reason?: string) => void;
  convertApplicationToStudent: (applicationId: string) => void;

  // Roles & Permissions RBAC
  roles: RoleDefinition[];
  setRoles: React.Dispatch<React.SetStateAction<RoleDefinition[]>>;
  hasPermission: (permission: PermissionKey) => boolean;
  hasAllPermissions: (permissions: PermissionKey[]) => boolean;
  hasAnyPermission: (permissions: PermissionKey[]) => boolean;
  togglePermissionForRole: (roleId: UserRole, permission: PermissionKey) => void;
  resetRolesToDefault: () => void;
  addNewRole: (role: Omit<RoleDefinition, 'userCount'>) => boolean;
  deleteCustomRole: (roleId: string) => boolean;
  updateRoleDetails: (roleId: string, updates: Partial<RoleDefinition>) => void;
  canAccessPage: (page: PageId) => boolean;

  // Data Masking & PII Security Helpers
  maskPhone: (phone: string) => string;
  maskEmail: (email: string) => string;
  maskCurrency: (amount: number) => string;

  // Persistence & Factory Reset
  resetAllDataToFactory: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('LEAD-1049');
  const [selectedCampus, setSelectedCampus] = useState<string>('All Campuses');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('Academic Year 2026-27');
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('USD');
  const [currentTimezone, setCurrentTimezone] = useState<string>('Asia/Kolkata');
  
  // Support multiple concurrent roles (e.g. ['Admissions Counsellor', 'CRM Manager'])
  const [currentUserRoles, setCurrentUserRoles] = useState<UserRole[]>(['Head of Admissions']);
  
  // Backwards compatibility primary role
  const currentUserRole = currentUserRoles[0] || 'Admissions Counsellor';
  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUserRoles([role]);
  };

  const toggleCurrentUserRole = (role: UserRole) => {
    setCurrentUserRoles((prev) => {
      if (prev.includes(role)) {
        if (prev.length <= 1) return prev; // Keep at least one active role
        return prev.filter((r) => r !== role);
      }
      return [...prev, role];
    });
  };

  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const getStoredState = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`iapl_crm_${key}`);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  const [leads, setLeads] = useState<Lead[]>(() => getStoredState('leads', INITIAL_LEADS));
  const [tasks, setTasks] = useState<Task[]>(() => getStoredState('tasks', INITIAL_TASKS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStoredState('appointments', INITIAL_APPOINTMENTS));
  const [applications, setApplications] = useState<Application[]>(() => getStoredState('applications', INITIAL_APPLICATIONS));
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => getStoredState('documents', INITIAL_DOCUMENTS));
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>(() => getStoredState('admissions', INITIAL_ADMISSIONS));
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [messages, setMessages] = useState<CommunicationMessage[]>(INITIAL_MESSAGES);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>(INITIAL_WORKFLOWS);
  const [sequences, setSequences] = useState<NurturingSequence[]>(INITIAL_SEQUENCES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  useEffect(() => {
    try { localStorage.setItem('iapl_crm_leads', JSON.stringify(leads)); } catch {}
  }, [leads]);
  useEffect(() => {
    try { localStorage.setItem('iapl_crm_tasks', JSON.stringify(tasks)); } catch {}
  }, [tasks]);
  useEffect(() => {
    try { localStorage.setItem('iapl_crm_appointments', JSON.stringify(appointments)); } catch {}
  }, [appointments]);
  useEffect(() => {
    try { localStorage.setItem('iapl_crm_applications', JSON.stringify(applications)); } catch {}
  }, [applications]);
  useEffect(() => {
    try { localStorage.setItem('iapl_crm_documents', JSON.stringify(documents)); } catch {}
  }, [documents]);
  useEffect(() => {
    try { localStorage.setItem('iapl_crm_admissions', JSON.stringify(admissions)); } catch {}
  }, [admissions]);
  const [counsellors, setCounsellors] = useState<Counsellor[]>(INITIAL_COUNSELLORS);
  const [courses] = useState<Course[]>(INITIAL_COURSES);

  // Third-party Integrations State
  const [integrations, setIntegrations] = useState<IntegrationServiceItem[]>(INITIAL_INTEGRATIONS);
  const [metaForms, setMetaForms] = useState<MetaLeadForm[]>(INITIAL_META_FORMS);
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplateItem[]>(INITIAL_WHATSAPP_TEMPLATES);
  const [webhookLogs, setWebhookLogs] = useState<WebhookEventLog[]>(INITIAL_WEBHOOK_LOGS);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(INITIAL_FIELD_MAPPINGS);
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'High priority lead assigned: Zoya Qureshi (Lucknow)',
      time: '15 mins ago',
      read: false,
      type: 'lead',
      linkTo: 'leads',
    },
    {
      id: 'notif-2',
      title: 'Token fee paid ₹50,000 by Kavya Subramanian',
      time: '1 hour ago',
      read: false,
      type: 'payment',
      linkTo: 'admissions',
    },
    {
      id: 'notif-3',
      title: 'Overdue task: Verify Design Aptitude Portfolio',
      time: '2 hours ago',
      read: false,
      type: 'task',
      linkTo: 'tasks',
    },
    {
      id: 'notif-4',
      title: 'Class 12 Marks upload verified for Aditya Deshmukh',
      time: 'Yesterday',
      read: true,
      type: 'document',
      linkTo: 'documents',
    },
  ]);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (t: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      title: 'Notifications Cleared',
      message: 'All notifications marked as read',
      type: 'info',
    });
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'notesCount' | 'tasksCount' | 'applicationsCount'>) => {
    const newId = `LEAD-${1050 + leads.length}`;
    const newLead: Lead = {
      ...leadData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      notesCount: 1,
      tasksCount: 1,
      applicationsCount: 0,
    };
    setLeads((prev) => [newLead, ...prev]);

    // Create audit log
    const log: AuditLogItem = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      userName: 'Current User',
      userRole: currentUserRole,
      action: 'Create',
      entity: 'Lead',
      entityId: newId,
      details: `Created new lead record for ${newLead.name} (${newLead.interestedCourse})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '103.21.144.12',
    };
    setAuditLogs((prev) => [log, ...prev]);

    addToast({
      title: 'Lead Created',
      message: `Lead ${newLead.name} was successfully registered and assigned to ${newLead.assignedCounsellorName}`,
      type: 'success',
    });
  };

  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: newStatus,
              lastActivity: `Stage shifted to ${newStatus}`,
            }
          : l
      )
    );

    const log: AuditLogItem = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      userName: 'Current User',
      userRole: currentUserRole,
      action: 'Status Change',
      entity: 'Lead',
      entityId: leadId,
      details: `Updated stage to "${newStatus}"`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '103.21.144.12',
    };
    setAuditLogs((prev) => [log, ...prev]);

    addToast({
      title: 'Pipeline Updated',
      message: `Lead ${leadId} updated to "${newStatus}"`,
      type: 'info',
    });
  };

  const assignLead = (leadId: string, counsellorId: string) => {
    const targetCounsellor = counsellors.find((c) => c.id === counsellorId);
    if (!targetCounsellor) return;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assignedCounsellorId: targetCounsellor.id,
              assignedCounsellorName: targetCounsellor.name,
              lastActivity: `Reassigned to ${targetCounsellor.name}`,
            }
          : l
      )
    );

    addToast({
      title: 'Lead Reassigned',
      message: `Assigned to ${targetCounsellor.name} (${targetCounsellor.campus})`,
      type: 'success',
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.status === 'Completed';
          const newStatus = isDone ? 'Pending' : 'Completed';
          return {
            ...t,
            status: newStatus,
            completedAt: isDone ? undefined : new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return t;
      })
    );
    addToast({
      title: 'Task Updated',
      message: `Task ${taskId} status toggled`,
      type: 'info',
    });
  };

  const verifyDocument = (docId: string, verified: boolean, reason?: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            status: verified ? 'Verified' : 'Rejected',
            rejectionReason: verified ? undefined : reason || 'Document validation failed criteria',
            reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            reviewer: 'Current User',
          };
        }
        return d;
      })
    );

    addToast({
      title: verified ? 'Document Approved' : 'Document Rejected',
      message: `Document ${docId} has been ${verified ? 'verified and marked valid' : 'flagged for resubmission'}`,
      type: verified ? 'success' : 'warning',
    });
  };

  const convertApplicationToStudent = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    // Check duplicate
    const newStudentId = `IAPL-2026-${app.course.includes('B.Tech') ? 'BT' : app.course.includes('MBA') ? 'MBA' : 'PG'}-${Math.floor(100 + Math.random() * 900)}`;

    const newAdmission: AdmissionRecord = {
      id: `ADM-2026-${admissions.length + 104}`,
      applicationId: app.id,
      studentName: app.applicantName,
      course: app.course,
      campus: app.campus,
      offerDate: new Date().toISOString().split('T')[0],
      offerStatus: 'Accepted',
      feeStatus: 'Paid in Full',
      feeAmount: 250000,
      feePaid: 250000,
      studentId: newStudentId,
      registrationStatus: 'Enrolled',
      onboardingStepsCompleted: 5,
      totalOnboardingSteps: 6,
      duplicateCheckPassed: true,
    };

    setAdmissions((prev) => [newAdmission, ...prev]);

    // Update application status
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'Approved' } : a))
    );

    // Update lead status if exists
    setLeads((prev) =>
      prev.map((l) => (l.id === app.applicantId ? { ...l, status: 'Enrolled' } : l))
    );

    addToast({
      title: 'Enrolment Confirmed',
      message: `Enrolled ${app.applicantName} with Student ID: ${newStudentId}`,
      type: 'success',
    });
  };

  const toggleIntegrationConnection = (id: string) => {
    if (!hasPermission('integrations.manage')) {
      addToast({
        title: '403 Forbidden - Security Block',
        message: 'Action Denied: Modifying integration connections requires "integrations.manage" permission.',
        type: 'error',
      });
      return;
    }

    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isConnected = item.status === 'Connected';
          const nextStatus = isConnected ? 'Disconnected' : 'Connected';
          return {
            ...item,
            status: nextStatus,
            lastSyncTimestamp: nextStatus === 'Connected' ? 'Just now' : item.lastSyncTimestamp,
          };
        }
        return item;
      })
    );

    const target = integrations.find((i) => i.id === id);
    addToast({
      title: target?.status === 'Connected' ? 'Integration Disconnected' : 'Integration Connected',
      message: `${target?.name || 'Service'} connection state has been updated.`,
      type: 'info',
    });
  };

  const syncIntegrationNow = (id: string) => {
    if (!hasPermission('integrations.dispatch_api')) {
      addToast({
        title: '403 Forbidden - API Sync Denied',
        message: 'Direct API Synchronization is restricted. Your assigned roles lack "integrations.dispatch_api".',
        type: 'error',
      });
      return;
    }

    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'Connected',
            lastSyncTimestamp: 'Just now',
            leadsReceivedCount: item.leadsReceivedCount + 1,
          };
        }
        return item;
      })
    );

    const target = integrations.find((i) => i.id === id);
    addToast({
      title: 'Sync Succeeded (200 OK)',
      message: `Pulled newest leads & event updates from ${target?.name || 'integration'}.`,
      type: 'success',
    });
  };

  const testIntegrationConnection = (id: string) => {
    if (!hasPermission('integrations.dispatch_api')) {
      addToast({
        title: '403 Forbidden - Handshake Denied',
        message: 'Endpoint verification blocked: Missing "integrations.dispatch_api" privilege.',
        type: 'error',
      });
      return;
    }

    const target = integrations.find((i) => i.id === id);
    addToast({
      title: 'Ping Verification: 200 OK',
      message: `Endpoint active. Webhook handshake verified for ${target?.name || 'Service'}.`,
      type: 'success',
    });
  };

  const retryWebhook = (logId: string) => {
    if (!hasPermission('integrations.dispatch_api')) {
      addToast({
        title: '403 Forbidden - Replay Denied',
        message: 'Re-dispatching webhook events is blocked: Missing "integrations.dispatch_api" permission.',
        type: 'error',
      });
      return;
    }

    setWebhookLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          return {
            ...log,
            status: 'Retried',
            retryCount: log.retryCount + 1,
            errorReason: undefined,
          };
        }
        return log;
      })
    );

    addToast({
      title: 'Webhook Re-dispatched (200 OK)',
      message: `Successfully re-executed webhook ${logId} and ingested candidate record.`,
      type: 'success',
    });
  };

  const updateFieldMapping = (mappingId: string, newTarget: string) => {
    if (!hasPermission('integrations.manage')) {
      addToast({
        title: '403 Forbidden - Access Denied',
        message: 'Configuring schema mappings requires "integrations.manage" permission.',
        type: 'error',
      });
      return;
    }

    setFieldMappings((prev) =>
      prev.map((m) => (m.id === mappingId ? { ...m, targetCrmField: newTarget } : m))
    );
    addToast({
      title: 'Mapping Updated',
      message: 'Field attribute mapping synchronized for incoming leads.',
      type: 'info',
    });
  };

  const simulateInboundLead = (provider: string) => {
    if (!hasPermission('integrations.dispatch_api')) {
      addToast({
        title: '403 Forbidden - Lead Ingestion Denied',
        message: `Simulated lead webhook blocked: Your active roles lack "integrations.dispatch_api".`,
        type: 'error',
      });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const mockLeadName = provider.includes('LinkedIn')
      ? 'Rajiv Menon (VP Product)'
      : provider.includes('WhatsApp')
      ? 'Simran Kaur (+91 98110 44221)'
      : 'Devika Sharma';

    const sourceTag = provider.includes('LinkedIn')
      ? 'Meta Ads' // falls in LeadSource
      : provider.includes('WhatsApp')
      ? 'Website Form'
      : 'Meta Ads';

    const newLead: Lead = {
      id: `LEAD-${1050 + leads.length}`,
      name: mockLeadName,
      email: `applicant.${randomNum}@example.edu`,
      phone: `+91 98200 ${randomNum}10`,
      city: 'Mumbai',
      state: 'Maharashtra',
      interestedCourse: 'B.Tech in Computer Science & Artificial Intelligence',
      preferredCampus: 'Mumbai Main Campus',
      source: sourceTag as any,
      assignedCounsellorId: 'cns-1',
      assignedCounsellorName: 'Aarav Sharma',
      status: 'New Enquiry',
      priority: 'High',
      score: 80,
      scoreCategory: 'Hot',
      scoreExplanation: `Instantly captured from live ${provider} Lead Sync Webhook with verified phone number.`,
      engagementLevel: 'Very High',
      lastActivity: `Ingested via ${provider} webhook`,
      nextFollowUp: 'Today 02:00 PM',
      createdAt: new Date().toISOString().split('T')[0],
      academicBackground: {
        qualification: 'Class 12 / Degree',
        percentageOrGpa: '86.4%',
        institution: 'National Board',
        passingYear: 2026,
      },
      consent: { whatsapp: true, email: true, call: true },
      tags: [provider, 'Auto-Synced', 'Instant Inbound'],
      notesCount: 1,
      tasksCount: 1,
      applicationsCount: 0,
      utmSource: provider.toLowerCase().replace(/\s+/g, '-'),
    };

    setLeads((prev) => [newLead, ...prev]);

    // Add webhook log entry
    const newLog: WebhookEventLog = {
      id: `WHK-LOG-${Date.now().toString().slice(-4)}`,
      platform: (provider.includes('WhatsApp') ? 'WhatsApp Cloud API' : provider.includes('LinkedIn') ? 'LinkedIn Lead Gen' : 'Meta Ads') as any,
      eventType: 'leadgen.lead_create',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Success',
      payloadSummary: `Live real-time lead sync captured "${mockLeadName}" via ${provider}`,
      retryCount: 0,
    };
    setWebhookLogs((prev) => [newLog, ...prev]);

    addToast({
      title: `⚡ Live Inbound Lead (${provider})`,
      message: `Captured "${mockLeadName}" -> Assigned to Aarav Sharma.`,
      type: 'success',
    });
  };

  // Multi-Role RBAC Permission resolution: Union of all permissions granted across assigned roles
  const effectivePermissions = useMemo<PermissionKey[]>(() => {
    const permSet = new Set<PermissionKey>();
    currentUserRoles.forEach((roleId) => {
      const roleDef = roles.find((r) => r.id === roleId);
      if (roleDef) {
        roleDef.permissions.forEach((p) => permSet.add(p));
      }
    });
    return Array.from(permSet);
  }, [currentUserRoles, roles]);

  const hasPermission = (permission: PermissionKey): boolean => {
    return effectivePermissions.includes(permission);
  };

  const hasAllPermissions = (perms: PermissionKey[]): boolean => {
    return perms.every((p) => effectivePermissions.includes(p));
  };

  const hasAnyPermission = (perms: PermissionKey[]): boolean => {
    return perms.some((p) => effectivePermissions.includes(p));
  };

  // Data Masking Helpers
  const maskPhone = (phone: string): string => {
    if (hasPermission('leads.view_pii')) return phone;
    if (!phone) return '••••••••••';
    const clean = phone.trim();
    if (clean.length < 8) return '••••••••';
    const prefix = clean.slice(0, 7);
    const suffix = clean.slice(-3);
    return `${prefix}*** ${suffix}`;
  };

  const maskEmail = (email: string): string => {
    if (hasPermission('leads.view_pii')) return email;
    if (!email || !email.includes('@')) return '•••••@restricted.edu';
    const [local, domain] = email.split('@');
    const visible = local.slice(0, 2);
    return `${visible}***@${domain}`;
  };

  const maskCurrency = (amount: number): string => {
    return formatInternationalCurrency(
      amount,
      currentCurrency,
      !hasPermission('admissions.view_financials')
    );
  };

  const updateCounsellorRoles = (counsellorId: string, newRoles: UserRole[]) => {
    if (newRoles.length === 0) return;
    setCounsellors((prev) =>
      prev.map((c) => (c.id === counsellorId ? { ...c, assignedRoles: newRoles } : c))
    );

    const target = counsellors.find((c) => c.id === counsellorId);
    const auditEntry: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: 'Security Administrator',
      userRole: currentUserRoles.join(' + '),
      action: 'Permission Change',
      entity: 'Security & RBAC',
      entityId: counsellorId,
      details: `Assigned multi-roles [${newRoles.join(', ')}] to staff ${target?.name || counsellorId}.`,
      ipAddress: '192.168.1.45',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    addToast({
      title: 'Staff Roles Updated',
      message: `Assigned roles for ${target?.name || 'counsellor'} set to: ${newRoles.join(', ')}`,
      type: 'success',
    });
  };

  const togglePermissionForRole = (roleId: UserRole, permission: PermissionKey) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r;
        const exists = r.permissions.includes(permission);
        const updated = exists
          ? r.permissions.filter((p) => p !== permission)
          : [...r.permissions, permission];
        return { ...r, permissions: updated };
      })
    );

    // Record in audit log
    const auditEntry: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: 'Dr. Rajeshwari Sen (Super Admin)',
      userRole: currentUserRoles.join(' + '),
      action: 'Permission Change',
      entity: 'Security & RBAC',
      entityId: roleId,
      details: `Updated permission "${permission}" for role "${roleId}".`,
      ipAddress: '192.168.1.45',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    addToast({
      title: 'Permissions Matrix Updated',
      message: `Updated "${permission}" for role "${roleId}". Changes take effect immediately.`,
      type: 'info',
    });
  };

  const resetRolesToDefault = () => {
    setRoles(INITIAL_ROLES);
    const auditEntry: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: 'Dr. Rajeshwari Sen (Super Admin)',
      userRole: currentUserRoles.join(' + '),
      action: 'Security Policy Reset',
      entity: 'Security & RBAC',
      entityId: 'RBAC-GLOBAL',
      details: 'Restored all institutional roles and permission matrices to baseline defaults.',
      ipAddress: '192.168.1.45',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    addToast({
      title: 'Permissions Reset',
      message: 'All roles have been restored to their standard institutional permission sets.',
      type: 'success',
    });
  };

  const addNewRole = (roleData: Omit<RoleDefinition, 'userCount'>): boolean => {
    const trimmedId = roleData.id.trim();
    if (!trimmedId) {
      addToast({
        title: 'Role Identifier Required',
        message: 'Please provide a unique title or role identifier.',
        type: 'error',
      });
      return false;
    }

    const alreadyExists = roles.some(
      (r) => r.id.toLowerCase() === trimmedId.toLowerCase() || r.name.toLowerCase() === roleData.name.trim().toLowerCase()
    );
    if (alreadyExists) {
      addToast({
        title: 'Role Identifier In Use',
        message: `An institutional role with the identifier "${trimmedId}" already exists.`,
        type: 'warning',
      });
      return false;
    }

    const newRole: RoleDefinition = {
      ...roleData,
      id: trimmedId,
      name: roleData.name.trim() || trimmedId,
      tagline: roleData.tagline.trim() || `${roleData.department || 'Institutional'} departmental authority`,
      description: roleData.description.trim() || 'Custom department role configured with institutional access boundaries.',
      badgeClass: roleData.badgeClass || 'bg-slate-100 text-slate-800 border-slate-200',
      department: roleData.department?.trim() || 'General Operations',
      isCustom: true,
      userCount: 0,
      permissions: roleData.permissions || [],
    };

    setRoles((prev) => [...prev, newRole]);

    const auditEntry: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: 'Dr. Rajeshwari Sen (Super Admin)',
      userRole: currentUserRoles.join(' + '),
      action: 'Role Created',
      entity: 'Security & RBAC',
      entityId: newRole.id,
      details: `Created new institutional role "${newRole.name}" under Department "${newRole.department}" with ${newRole.permissions.length} initial permissions.`,
      ipAddress: '192.168.1.45',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    addToast({
      title: 'Institutional Role Created',
      message: `Role "${newRole.name}" (${newRole.department}) successfully added with ${newRole.permissions.length} permissions.`,
      type: 'success',
    });
    return true;
  };

  const deleteCustomRole = (roleId: string): boolean => {
    const roleToDelete = roles.find((r) => r.id === roleId);
    if (!roleToDelete) return false;

    // Foundation immutable system roles
    const systemRoles = ['Super Admin', 'Head of Admissions', 'CRM Manager', 'Admissions Counsellor'];
    if (systemRoles.includes(roleId) || roleToDelete.isCustom === false) {
      addToast({
        title: 'Deletion Restricted',
        message: `System role "${roleId}" is a foundational institutional role and cannot be deleted.`,
        type: 'error',
      });
      return false;
    }

    setRoles((prev) => prev.filter((r) => r.id !== roleId));

    // Remove from active session if current user was running under it
    setCurrentUserRoles((prev) => {
      const filtered = prev.filter((r) => r !== roleId);
      return filtered.length > 0 ? filtered : ['Admissions Counsellor'];
    });

    // Remove from any counsellors assigned to this role
    setCounsellors((prev) =>
      prev.map((c) => ({
        ...c,
        assignedRoles: (c.assignedRoles || []).filter((r) => r !== roleId).length > 0
          ? (c.assignedRoles || []).filter((r) => r !== roleId)
          : ['Admissions Counsellor'],
      }))
    );

    const auditEntry: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: 'Dr. Rajeshwari Sen (Super Admin)',
      userRole: currentUserRoles.join(' + '),
      action: 'Role Deleted',
      entity: 'Security & RBAC',
      entityId: roleId,
      details: `Deleted custom departmental role "${roleToDelete.name}".`,
      ipAddress: '192.168.1.45',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    addToast({
      title: 'Custom Role Deleted',
      message: `Department role "${roleToDelete.name}" has been removed from the institutional catalog.`,
      type: 'info',
    });
    return true;
  };

  const updateRoleDetails = (roleId: string, updates: Partial<RoleDefinition>) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, ...updates } : r))
    );
    addToast({
      title: 'Role Updated',
      message: `Configuration for "${roleId}" updated successfully.`,
      type: 'success',
    });
  };

  const canAccessPage = (page: PageId): boolean => {
    switch (page) {
      case 'roles':
        return hasPermission('roles.manage');
      case 'integrations':
        return hasPermission('integrations.manage');
      case 'settings':
        return hasPermission('settings.manage');
      case 'audit':
        return hasPermission('audit.view');
      case 'workflows':
        return hasPermission('workflows.manage');
      case 'campaigns':
        return hasPermission('campaigns.manage');
      case 'nurturing':
        return hasPermission('nurturing.manage');
      case 'ai-scoring':
        return hasPermission('ai.configure_scoring');
      case 'users':
        return hasPermission('users.manage');
      default:
        return true;
    }
  };

  const resetAllDataToFactory = () => {
    try {
      localStorage.removeItem('iapl_crm_leads');
      localStorage.removeItem('iapl_crm_tasks');
      localStorage.removeItem('iapl_crm_appointments');
      localStorage.removeItem('iapl_crm_applications');
      localStorage.removeItem('iapl_crm_documents');
      localStorage.removeItem('iapl_crm_admissions');
    } catch {}
    setLeads(INITIAL_LEADS);
    setTasks(INITIAL_TASKS);
    setAppointments(INITIAL_APPOINTMENTS);
    setApplications(INITIAL_APPLICATIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setAdmissions(INITIAL_ADMISSIONS);
    addToast({
      title: 'Demo Environment Reset',
      message: 'All records, tasks, applications, and documents restored to initial state.',
      type: 'info',
    });
  };

  const value = useMemo(
    () => ({
      currentPage,
      setCurrentPage,
      selectedLeadId,
      setSelectedLeadId,
      selectedCampus,
      setSelectedCampus,
      selectedDateRange,
      setSelectedDateRange,
      currentCurrency,
      setCurrentCurrency,
      currentTimezone,
      setCurrentTimezone,
      currentUserRole,
      setCurrentUserRole,
      currentUserRoles,
      setCurrentUserRoles,
      toggleCurrentUserRole,
      effectivePermissions,
      globalSearchQuery,
      setGlobalSearchQuery,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      leads,
      setLeads,
      tasks,
      setTasks,
      appointments,
      setAppointments,
      applications,
      setApplications,
      documents,
      setDocuments,
      admissions,
      setAdmissions,
      campaigns,
      setCampaigns,
      messages,
      setMessages,
      workflows,
      setWorkflows,
      sequences,
      setSequences,
      auditLogs,
      counsellors,
      setCounsellors,
      updateCounsellorRoles,
      courses,
      integrations,
      setIntegrations,
      metaForms,
      setMetaForms,
      whatsappTemplates,
      setWhatsappTemplates,
      webhookLogs,
      setWebhookLogs,
      fieldMappings,
      setFieldMappings,
      toggleIntegrationConnection,
      syncIntegrationNow,
      testIntegrationConnection,
      retryWebhook,
      updateFieldMapping,
      simulateInboundLead,
      notifications,
      markAllNotificationsRead,
      toasts,
      addToast,
      removeToast,
      addLead,
      updateLeadStatus,
      assignLead,
      toggleTaskCompletion,
      verifyDocument,
      convertApplicationToStudent,
      roles,
      setRoles,
      hasPermission,
      hasAllPermissions,
      hasAnyPermission,
      togglePermissionForRole,
      resetRolesToDefault,
      addNewRole,
      deleteCustomRole,
      updateRoleDetails,
      canAccessPage,
      maskPhone,
      maskEmail,
      maskCurrency,
      resetAllDataToFactory,
    }),
    [
      currentPage,
      selectedLeadId,
      selectedCampus,
      selectedDateRange,
      currentCurrency,
      currentTimezone,
      currentUserRole,
      currentUserRoles,
      effectivePermissions,
      globalSearchQuery,
      isSidebarCollapsed,
      leads,
      tasks,
      appointments,
      applications,
      documents,
      admissions,
      campaigns,
      messages,
      workflows,
      sequences,
      auditLogs,
      counsellors,
      courses,
      integrations,
      metaForms,
      whatsappTemplates,
      webhookLogs,
      fieldMappings,
      notifications,
      toasts,
      roles,
    ]
  );

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
