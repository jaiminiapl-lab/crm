import React, { useState } from 'react';
import { useCRM } from '../../../../shared/services';
import { useKeyboardShortcut } from '../../../../shared/hooks';
import { SearchResultItemModel } from '../types/global-search.types';
import { useGlobalSearch } from '../model/useGlobalSearch';
import { useSearchKeyboard } from '../model/useSearchKeyboard';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchLoadingState } from './SearchLoadingState';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const { setCurrentPage, setSelectedLeadId } = useCRM();
  const [query, setQuery] = useState('');

  const { debouncedQuery, isLoading, groupedResults, flatResults, totalCount } =
    useGlobalSearch(query);

  const handleSelectResult = (item: SearchResultItemModel) => {
    if (item.category === 'LEADS') {
      setSelectedLeadId(item.targetId);
      setCurrentPage('lead-details');
    } else if (item.category === 'APPLICANTS') {
      setCurrentPage('applications');
    } else if (item.category === 'TASKS') {
      setCurrentPage('tasks');
    }
    onClose();
    setQuery('');
  };

  const { selectedIndex, setSelectedIndex, handleKeyDown } = useSearchKeyboard({
    flatResults,
    isOpen,
    onSelect: handleSelectResult,
    onClose,
  });

  // Global shortcut: Escape to close
  useKeyboardShortcut({ key: 'Escape' }, onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div
        onKeyDown={handleKeyDown}
        className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 z-10"
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          isLoading={isLoading}
          autoFocus
        />

        <div className="min-h-[140px] max-h-[60vh] overflow-y-auto">
          {isLoading && <SearchLoadingState />}

          {!isLoading && query.trim() && totalCount === 0 && (
            <SearchEmptyState query={query} />
          )}

          {!isLoading && totalCount > 0 && (
            <SearchResults
              groupedResults={groupedResults}
              flatResults={flatResults}
              selectedIndex={selectedIndex}
              query={debouncedQuery}
              onSelect={handleSelectResult}
              onHoverIndex={setSelectedIndex}
            />
          )}

          {!query.trim() && (
            <div className="py-10 px-6 text-center text-slate-400">
              <div className="text-xs font-medium text-slate-600 mb-1">
                Spotlight Search across Campus Database
              </div>
              <p className="text-[11px] text-slate-400">
                Type candidate names, lead IDs (LEAD-1049), applicant tracking codes, or tasks.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/90 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-2xs">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-2xs">
                ↵
              </kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-2xs">
                esc
              </kbd>
              <span>to close</span>
            </span>
          </div>
          {totalCount > 0 && (
            <span className="text-[10px] text-slate-400 font-mono">
              {totalCount} matching record{totalCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
