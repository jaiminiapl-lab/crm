import { Lead, Application, Task } from '../../../../shared/types';
import { SearchResultItemModel } from '../types/global-search.types';

export function mapLeadToSearchResult(
  lead: Lead,
  maskPhone: (p: string) => string
): SearchResultItemModel {
  return {
    id: lead.id,
    title: lead.name,
    subtitle: `${lead.interestedCourse} • ${lead.preferredCampus || 'Main Campus'}`,
    category: 'LEADS',
    badgeText: lead.id,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    targetPage: 'lead-details',
    targetId: lead.id,
    metaInfo: `${maskPhone(lead.phone)} | AI Score: ${lead.score}`,
    status: lead.status,
  };
}

export function mapApplicationToSearchResult(
  app: Application
): SearchResultItemModel {
  return {
    id: app.id,
    title: app.applicantName,
    subtitle: `${app.course} • ${app.campus}`,
    category: 'APPLICANTS',
    badgeText: app.applicantId || app.id,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    targetPage: 'applications',
    targetId: app.id,
    metaInfo: `Status: ${app.status} | Docs: ${app.documentStatus}`,
    status: app.status,
  };
}

export function mapTaskToSearchResult(
  task: Task
): SearchResultItemModel {
  return {
    id: task.id,
    title: task.title,
    subtitle: `For: ${task.leadName} • Assigned: ${task.counsellorName}`,
    category: 'TASKS',
    badgeText: task.id,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    targetPage: 'tasks',
    targetId: task.id,
    metaInfo: `Due: ${task.dueDate} • Type: ${task.type}`,
    status: task.status,
  };
}
