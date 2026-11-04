import React from 'react';
import { Loader2 } from 'lucide-react';

export const SearchLoadingState: React.FC = () => {
  return (
    <div className="py-12 text-center text-slate-500">
      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
      <span className="text-xs text-slate-500">Searching records across modules...</span>
    </div>
  );
};
