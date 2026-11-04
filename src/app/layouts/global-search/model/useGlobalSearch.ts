import { useState, useMemo, useEffect } from 'react';
import { useCRM } from '../../../../shared/services';
import { useDebounce } from '../../../../shared/hooks';
import {
  SearchResultItemModel,
  GroupedSearchResults,
} from '../types/global-search.types';
import {
  SEARCH_DEBOUNCE_MS,
  MIN_SEARCH_QUERY_LENGTH,
  MAX_RESULTS_PER_CATEGORY,
} from './search.constants';
import {
  mapLeadToSearchResult,
  mapApplicationToSearchResult,
  mapTaskToSearchResult,
} from '../lib/search.mapper';

export function useGlobalSearch(rawQuery: string) {
  const { leads, applications, tasks, hasPermission, maskPhone } = useCRM();
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(rawQuery, SEARCH_DEBOUNCE_MS);

  // Set brief loading indicator when typing
  useEffect(() => {
    if (rawQuery.trim() !== debouncedQuery.trim() && rawQuery.trim().length >= MIN_SEARCH_QUERY_LENGTH) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [rawQuery, debouncedQuery]);

  const canViewLeads = hasPermission('leads.view_all') || hasPermission('leads.view_assigned_only');
  const canViewAdmissions = hasPermission('admissions.evaluate') || hasPermission('admissions.approve_offer');
  const canViewTasks = hasPermission('tasks.manage');

  const groupedResults = useMemo<GroupedSearchResults>(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const empty: GroupedSearchResults = { LEADS: [], APPLICANTS: [], TASKS: [] };

    if (!q || q.length < MIN_SEARCH_QUERY_LENGTH) {
      return empty;
    }

    // 1. Leads Search
    const leadResults: SearchResultItemModel[] = canViewLeads
      ? leads
          .filter(
            (l) =>
              l.name.toLowerCase().includes(q) ||
              l.id.toLowerCase().includes(q) ||
              l.email.toLowerCase().includes(q) ||
              l.phone.includes(q) ||
              l.interestedCourse.toLowerCase().includes(q)
          )
          .slice(0, MAX_RESULTS_PER_CATEGORY)
          .map((l) => mapLeadToSearchResult(l, maskPhone))
      : [];

    // 2. Applicants Search
    const appResults: SearchResultItemModel[] = canViewAdmissions
      ? applications
          .filter(
            (a) =>
              a.applicantName.toLowerCase().includes(q) ||
              a.id.toLowerCase().includes(q) ||
              (a.applicantId && a.applicantId.toLowerCase().includes(q)) ||
              a.course.toLowerCase().includes(q) ||
              a.email.toLowerCase().includes(q)
          )
          .slice(0, MAX_RESULTS_PER_CATEGORY)
          .map(mapApplicationToSearchResult)
      : [];

    // 3. Tasks Search
    const taskResults: SearchResultItemModel[] = canViewTasks
      ? tasks
          .filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.id.toLowerCase().includes(q) ||
              t.leadName.toLowerCase().includes(q) ||
              t.counsellorName.toLowerCase().includes(q)
          )
          .slice(0, MAX_RESULTS_PER_CATEGORY)
          .map(mapTaskToSearchResult)
      : [];

    return {
      LEADS: leadResults,
      APPLICANTS: appResults,
      TASKS: taskResults,
    };
  }, [debouncedQuery, leads, applications, tasks, canViewLeads, canViewAdmissions, canViewTasks, maskPhone]);

  const flatResults = useMemo(() => {
    return [
      ...groupedResults.LEADS,
      ...groupedResults.APPLICANTS,
      ...groupedResults.TASKS,
    ];
  }, [groupedResults]);

  return {
    debouncedQuery,
    isLoading,
    groupedResults,
    flatResults,
    totalCount: flatResults.length,
  };
}
