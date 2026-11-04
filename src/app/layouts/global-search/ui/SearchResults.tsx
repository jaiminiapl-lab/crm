import React from 'react';
import {
  GroupedSearchResults,
  SearchResultItemModel,
  SearchCategory,
} from '../types/global-search.types';
import { CATEGORY_METADATA } from '../model/search.constants';
import { SearchResultItem } from './SearchResultItem';

interface SearchResultsProps {
  groupedResults: GroupedSearchResults;
  flatResults: SearchResultItemModel[];
  selectedIndex: number;
  query: string;
  onSelect: (item: SearchResultItemModel) => void;
  onHoverIndex: (index: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  groupedResults,
  flatResults,
  selectedIndex,
  query,
  onSelect,
  onHoverIndex,
}) => {
  const categories: SearchCategory[] = ['LEADS', 'APPLICANTS', 'TASKS'];

  return (
    <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto custom-scrollbar">
      {categories.map((category) => {
        const items = groupedResults[category];
        if (!items || items.length === 0) return null;

        const meta = CATEGORY_METADATA[category];

        return (
          <div key={category} className="py-2">
            <div className="flex items-center justify-between px-4 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>{meta.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                {items.length}
              </span>
            </div>
            <div className="mt-1">
              {items.map((item) => {
                const itemIndex = flatResults.findIndex((r) => r.id === item.id && r.category === item.category);
                const isSelected = itemIndex === selectedIndex;

                return (
                  <SearchResultItem
                    key={`${item.category}-${item.id}`}
                    item={item}
                    query={query}
                    isSelected={isSelected}
                    onSelect={onSelect}
                    onMouseEnter={() => onHoverIndex(itemIndex)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
