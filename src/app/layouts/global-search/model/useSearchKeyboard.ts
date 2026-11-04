import { useState, useEffect, useCallback } from 'react';
import { SearchResultItemModel } from '../types/global-search.types';

interface UseSearchKeyboardProps {
  flatResults: SearchResultItemModel[];
  isOpen: boolean;
  onSelect: (item: SearchResultItemModel) => void;
  onClose: () => void;
}

export function useSearchKeyboard({
  flatResults,
  isOpen,
  onSelect,
  onClose,
}: UseSearchKeyboardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selectedIndex whenever results list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [flatResults.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          flatResults.length > 0 ? (prev + 1) % flatResults.length : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          flatResults.length > 0 ? (prev - 1 + flatResults.length) % flatResults.length : 0
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          onSelect(flatResults[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, flatResults, selectedIndex, onSelect, onClose]
  );

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
  };
}
