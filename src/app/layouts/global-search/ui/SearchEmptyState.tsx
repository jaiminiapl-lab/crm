import React from 'react';
import { SearchX } from 'lucide-react';

interface SearchEmptyStateProps {
  query: string;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ query }) => {
  return (
    <div className="py-12 px-6 text-center text-slate-500">
      <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-400 mb-3">
        <SearchX className="w-6 h-6" />
      </div>
      <div className="font-semibold text-slate-800 text-sm">
        No records match &ldquo;{query}&rdquo;
      </div>
      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
        Search by candidate name, lead ID (e.g. LEAD-1049), applicant ID, or action task title.
      </p>
    </div>
  );
};
