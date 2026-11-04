import { PageId, PermissionKey } from '../../shared';

export interface RouteDefinition {
  id: PageId;
  title: string;
  requiredPermission?: PermissionKey;
  isAdminOnly?: boolean;
}

export const APP_ROUTES: Record<PageId, RouteDefinition> = {
  dashboard: { id: 'dashboard', title: 'Admissions Control Dashboard' },
  leads: { id: 'leads', title: 'Applicant & Lead Management' },
  'lead-details': { id: 'lead-details', title: 'Applicant Dossier & Timeline' },
  pipeline: { id: 'pipeline', title: 'Admissions Qualification Funnel' },
  assignment: { id: 'assignment', title: 'Automated Lead Distribution' },
  tasks: { id: 'tasks', title: 'Staff Tasks & Due Follow-ups' },
  counselling: { id: 'counselling', title: 'Counselling Appointments & Calendar' },
  applications: { id: 'applications', title: 'Candidate Applications' },
  documents: { id: 'documents', title: 'Document Verification Portal' },
  admissions: { id: 'admissions', title: 'Offer Letters & Enrolment' },
  campaigns: { id: 'campaigns', title: 'Campaign Attribution & Meta Ads', requiredPermission: 'campaigns.manage' },
  communication: { id: 'communication', title: 'Omnichannel Communication Hub' },
  'ai-scoring': { id: 'ai-scoring', title: 'AI Scoring Engine', requiredPermission: 'ai.configure_scoring' },
  'ai-assistant': { id: 'ai-assistant', title: 'AI Admissions Copilot' },
  nurturing: { id: 'nurturing', title: 'Drip Nurturing Sequences', requiredPermission: 'nurturing.manage' },
  'conversion-prediction': { id: 'conversion-prediction', title: 'Conversion Probability Engine' },
  workflows: { id: 'workflows', title: 'Trigger & Action Workflows', requiredPermission: 'workflows.manage', isAdminOnly: true },
  recommendations: { id: 'recommendations', title: 'Academic Program Matching' },
  reports: { id: 'reports', title: 'Executive Analytics & Cohort Reports' },
  users: { id: 'users', title: 'User Accounts & Counsellor Rosters', requiredPermission: 'users.manage', isAdminOnly: true },
  settings: { id: 'settings', title: 'Global System Configuration', requiredPermission: 'settings.manage', isAdminOnly: true },
  audit: { id: 'audit', title: 'Immutable Security Audit Logs', requiredPermission: 'audit.view', isAdminOnly: true },
  integrations: { id: 'integrations', title: 'Third-Party Connectors & Webhooks', requiredPermission: 'integrations.manage', isAdminOnly: true },
  roles: { id: 'roles', title: 'Role-Based Access Control Matrix', requiredPermission: 'roles.manage', isAdminOnly: true },
  goals: { id: 'goals', title: 'Institutional Goals & Conversion Targets' },
};
