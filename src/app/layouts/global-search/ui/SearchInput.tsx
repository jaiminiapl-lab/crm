import React, { useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  isLoading = false,
  placeholder = 'Search leads, applicants, tasks by name, ID or course...',
  autoFocus = true,
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="relative flex items-center w-full px-4 py-3 border-b border-slate-200 bg-white">
      {isLoading ? (
        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin mr-3 shrink-0" />
      ) : (
        <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
      />
      {value && (
        <button
          onClick={onClear}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
