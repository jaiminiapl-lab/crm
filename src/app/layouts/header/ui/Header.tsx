import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { useCRM } from '../../../../shared/services';
import { useKeyboardShortcut } from '../../../../shared/hooks';
import { GlobalSearch } from '../../global-search';
import { HeaderActions } from './HeaderActions';

export const Header: React.FC = () => {
  const { setIsSidebarCollapsed } = useCRM();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K to open global search
  useKeyboardShortcut(
    { key: 'k', ctrlOrCmd: true, preventDefault: true },
    () => setIsSearchOpen(true)
  );

  // Shortcut '/' to open search
  useKeyboardShortcut(
    { key: '/', preventDefault: true },
    (e) => {
      // Don't trigger if user is already typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        setIsSearchOpen(true);
      }
    }
  );

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="p-2 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors lg:hidden"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar / Spotlight Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-between w-full max-w-md px-3 py-2 text-xs bg-slate-50 hover:bg-slate-100/90 text-slate-500 border border-slate-200 rounded-lg transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
            <span className="truncate">Search leads, applicants, tasks...</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-2xs font-semibold">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      <HeaderActions />

      {/* Global Search Spotlight Palette */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};
