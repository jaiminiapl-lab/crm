import { SearchCategory } from '../types/global-search.types';

export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_QUERY_LENGTH = 1;
export const MAX_RESULTS_PER_CATEGORY = 6;

export const SEARCH_CATEGORIES: SearchCategory[] = ['LEADS', 'APPLICANTS', 'TASKS'];

export const CATEGORY_METADATA: Record<
  SearchCategory,
  { label: string; singular: string; badgeClass: string }
> = {
  LEADS: {
    label: 'Leads & Enquiries',
    singular: 'Lead',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  APPLICANTS: {
    label: 'Admissions & Applicants',
    singular: 'Applicant',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  TASKS: {
    label: 'Action Tasks & Follow-ups',
    singular: 'Task',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};
