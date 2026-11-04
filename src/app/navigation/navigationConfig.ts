import { PageId, PermissionKey } from '../../shared';

export interface NavigationItem {
  id: PageId;
  label: string;
  iconName: string;
  requiredPermission?: PermissionKey;
  badge?: string;
  section?: 'core' | 'operations' | 'marketing' | 'intelligence' | 'system';
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  // Core CRM
  { id: 'dashboard', label: 'Dashboard', iconName: 'LayoutDashboard', section: 'core' },
  { id: 'leads', label: 'Leads & Enquiries', iconName: 'Users', section: 'core' },
  { id: 'pipeline', label: 'Admissions Pipeline', iconName: 'Kanban', section: 'core' },
  { id: 'tasks', label: 'Tasks & Follow-ups', iconName: 'CheckSquare', section: 'core' },
  { id: 'goals', label: 'Goals & Targets', iconName: 'Target', section: 'core', badge: 'New' },

  // Operations
  { id: 'applications', label: 'Applications', iconName: 'FileText', section: 'operations' },
  { id: 'documents', label: 'Document Verification', iconName: 'ShieldCheck', section: 'operations' },
  { id: 'admissions', label: 'Admissions & Enrolment', iconName: 'GraduationCap', section: 'operations' },
  { id: 'counselling', label: 'Counselling Schedule', iconName: 'Calendar', section: 'operations' },
  { id: 'assignment', label: 'Smart Lead Assignment', iconName: 'UserCheck', section: 'operations' },

  // Marketing & Communications
  { id: 'campaigns', label: 'Campaigns & Ads', iconName: 'Megaphone', requiredPermission: 'campaigns.manage', section: 'marketing' },
  { id: 'communication', label: 'Communication Hub', iconName: 'MessageSquare', section: 'marketing' },
  { id: 'nurturing', label: 'Lead Nurturing', iconName: 'Share2', requiredPermission: 'nurturing.manage', section: 'marketing' },

  // AI & Analytics
  { id: 'ai-scoring', label: 'AI Lead Scoring', iconName: 'Sparkles', requiredPermission: 'ai.configure_scoring', section: 'intelligence' },
  { id: 'conversion-prediction', label: 'Conversion Predictor', iconName: 'TrendingUp', section: 'intelligence' },
  { id: 'recommendations', label: 'Course Recommender', iconName: 'Compass', section: 'intelligence' },
  { id: 'reports', label: 'Analytics & Reports', iconName: 'BarChart3', section: 'intelligence' },

  // Administration & Governance
  { id: 'users', label: 'Staff & Counsellors', iconName: 'Users2', requiredPermission: 'users.manage', section: 'system' },
  { id: 'roles', label: 'Roles & Permissions', iconName: 'Shield', requiredPermission: 'roles.manage', section: 'system' },
  { id: 'workflows', label: 'Automation Rules', iconName: 'GitBranch', requiredPermission: 'workflows.manage', section: 'system' },
  { id: 'integrations', label: 'Third-Party Connectors', iconName: 'Layers', requiredPermission: 'integrations.manage', section: 'system' },
  { id: 'audit', label: 'Audit Trail Logs', iconName: 'History', requiredPermission: 'audit.view', section: 'system' },
  { id: 'settings', label: 'System Settings', iconName: 'Settings', requiredPermission: 'settings.manage', section: 'system' },
];
