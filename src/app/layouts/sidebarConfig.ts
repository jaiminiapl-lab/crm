import {
  LayoutDashboard,
  Users,
  Kanban,
  UserCheck,
  CalendarDays,
  CheckSquare,
  FileText,
  FileCheck2,
  GraduationCap,
  Megaphone,
  MessageSquare,
  Sparkles,
  Bot,
  GitBranch,
  TrendingUp,
  Sliders,
  Compass,
  BarChart3,
  UserCog,
  Settings,
  History,
  Shield,
  Share2,
  Target,
} from 'lucide-react';
import { PageId } from '../../shared/services';

export interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  pageNumber?: number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const getNavGroups = (counts: {
  newLeads: number;
  pendingTasks: number;
  pendingApps: number;
  pendingDocs: number;
}): NavGroup[] => [
  {
    title: 'Admissions Core',
    items: [
      { id: 'dashboard', label: 'CRM Dashboard', icon: LayoutDashboard, pageNumber: 1 },
      { id: 'goals', label: 'Goals & Targets', icon: Target, badge: 'Sprint', badgeColor: 'bg-emerald-600 text-white' },
      { id: 'leads', label: 'Lead Management', icon: Users, badge: counts.newLeads, badgeColor: 'bg-blue-100 text-blue-700', pageNumber: 2 },
      { id: 'pipeline', label: 'Lead Pipeline', icon: Kanban, pageNumber: 4 },
      { id: 'assignment', label: 'Smart Assignment', icon: UserCheck, pageNumber: 5 },
    ],
  },
  {
    title: 'Counselling & Engagement',
    items: [
      { id: 'counselling', label: 'Counselling & Appointments', icon: CalendarDays, pageNumber: 7 },
      { id: 'tasks', label: 'Tasks & Follow-Ups', icon: CheckSquare, badge: counts.pendingTasks, badgeColor: 'bg-amber-100 text-amber-800', pageNumber: 6 },
      { id: 'communication', label: 'Communication Hub', icon: MessageSquare, pageNumber: 12 },
      { id: 'recommendations', label: 'Course Recommendations', icon: Compass, pageNumber: 18 },
    ],
  },
  {
    title: 'Admissions & Enrolment',
    items: [
      { id: 'applications', label: 'Applications', icon: FileText, badge: counts.pendingApps, badgeColor: 'bg-purple-100 text-purple-700', pageNumber: 8 },
      { id: 'documents', label: 'Document Verification', icon: FileCheck2, badge: counts.pendingDocs, badgeColor: 'bg-amber-100 text-amber-800', pageNumber: 9 },
      { id: 'admissions', label: 'Admissions & Enrolment', icon: GraduationCap, pageNumber: 10 },
    ],
  },
  {
    title: 'Marketing & Nurturing',
    items: [
      { id: 'campaigns', label: 'Campaigns & Referrals', icon: Megaphone, pageNumber: 11 },
      { id: 'integrations', label: 'Third-Party Integrations', icon: Share2, badge: 'Live', badgeColor: 'bg-emerald-800 text-emerald-200' },
      { id: 'nurturing', label: 'Smart Lead Nurturing', icon: GitBranch, pageNumber: 15 },
    ],
  },
  {
    title: 'AI & Intelligence',
    items: [
      { id: 'ai-scoring', label: 'AI Lead Scoring', icon: Sparkles, pageNumber: 13 },
      { id: 'ai-assistant', label: 'AI Counsellor Assistant', icon: Bot, pageNumber: 14 },
      { id: 'conversion-prediction', label: 'Conversion Prediction', icon: TrendingUp, pageNumber: 16 },
      { id: 'workflows', label: 'Workflow Automation', icon: Sliders, pageNumber: 17 },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, pageNumber: 19 },
    ],
  },
  {
    title: 'Administration',
    items: [
      { id: 'roles', label: 'Roles & Permissions', icon: Shield, badge: 'RBAC', badgeColor: 'bg-blue-900 text-blue-200' },
      { id: 'users', label: 'Users & Counsellors', icon: UserCog, pageNumber: 20 },
      { id: 'settings', label: 'CRM Settings', icon: Settings, pageNumber: 21 },
      { id: 'audit', label: 'Audit Logs', icon: History, pageNumber: 22 },
    ],
  },
];
