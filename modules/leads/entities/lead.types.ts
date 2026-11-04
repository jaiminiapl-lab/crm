import { LeadStatus, LeadPriority, LeadSource } from '../../../shared/types';

export interface LeadEntityModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  interestedCourse: string;
  preferredCampus: string;
  source: LeadSource;
  assignedCounsellorId: string;
  assignedCounsellorName: string;
  status: LeadStatus;
  priority: LeadPriority;
  score: number;
  scoreCategory: 'Hot' | 'Warm' | 'Cold';
  scoreExplanation: string;
  engagementLevel: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Dormant';
  lastActivity: string;
  nextFollowUp: string;
  createdAt: string;
  tags: string[];
}
