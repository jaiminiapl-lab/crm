import React from 'react';
import { User, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { SearchResultItemModel } from '../types/global-search.types';
import { highlightMatches } from '../lib/search.utils';

interface SearchResultItemProps {
  item: SearchResultItemModel;
  query: string;
  isSelected: boolean;
  onSelect: (item: SearchResultItemModel) => void;
  onMouseEnter: () => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  query,
  isSelected,
  onSelect,
  onMouseEnter,
}) => {
  const getCategoryIcon = () => {
    switch (item.category) {
      case 'LEADS':
        return <User className="w-4 h-4 text-indigo-600" />;
      case 'APPLICANTS':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'TASKS':
        return <CheckCircle2 className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      onMouseEnter={onMouseEnter}
      className={`group flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-indigo-50/80 text-indigo-950 border-l-3 border-indigo-600'
          : 'hover:bg-slate-50 text-slate-800 border-l-3 border-transparent'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-1.5 rounded-md bg-white border border-slate-200 shadow-2xs shrink-0">
          {getCategoryIcon()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs truncate">
              {highlightMatches(item.title, query)}
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${
                item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {highlightMatches(item.badgeText, query)}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5">
            {highlightMatches(item.subtitle, query)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-3 shrink-0">
        {item.metaInfo && (
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            {item.metaInfo}
          </span>
        )}
        <ChevronRight
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isSelected ? 'translate-x-0.5 text-indigo-600' : 'opacity-0 group-hover:opacity-100'
          }`}
        />
      </div>
    </div>
  );
};
