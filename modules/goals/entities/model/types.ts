export type GoalCadence = 'weekly' | 'monthly' | 'quarterly';

export type GoalMetric =
  | 'leads'
  | 'applications'
  | 'enrolments'
  | 'revenue'
  | 'counselling_calls';

export type GoalStatus = 'on_track' | 'at_risk' | 'exceeded' | 'behind';

export interface WeeklyMilestone {
  weekNumber: number;
  weekLabel: string;
  target: number;
  actual: number;
  status: GoalStatus;
}

export interface GoalAssignee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarText: string;
  isManager: boolean;
}

export interface Goal {
  id: string;
  title: string;
  cadence: GoalCadence;
  periodLabel: string;
  metric: GoalMetric;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: GoalStatus;
  assignee: GoalAssignee;
  assignedBy: string;
  campus: string;
  department: string;
  startDate: string;
  endDate: string;
  milestones?: WeeklyMilestone[];
  notes?: string;
  lastUpdated: string;
}
