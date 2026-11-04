import { PageId } from '../../../../shared/services';

export type SearchCategory = 'LEADS' | 'APPLICANTS' | 'TASKS';

export interface SearchResultItemModel {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  badgeText: string;
  badgeColor?: string;
  targetPage: PageId;
  targetId: string;
  metaInfo?: string;
  status?: string;
}

export type GroupedSearchResults = Record<SearchCategory, SearchResultItemModel[]>;

export interface SearchState {
  query: string;
  isOpen: boolean;
  isLoading: boolean;
  activeCategory: SearchCategory | 'ALL';
  selectedIndex: number;
}
