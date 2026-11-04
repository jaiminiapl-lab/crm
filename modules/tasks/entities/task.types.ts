import { LeadPriority } from '../../../shared/types';

export interface TaskEntityModel {
  id: string;
  leadId: string;
  leadName: string;
  counsellorId: string;
  counsellorName: string;
  type: 'Call' | 'Email' | 'WhatsApp' | 'Campus Visit' | 'Document Review' | 'General';
  title: string;
  dueDate: string;
  dueTime: string;
  priority: LeadPriority;
  status: 'Pending' | 'Completed' | 'Overdue';
  completedAt?: string;
  notes?: string;
}
