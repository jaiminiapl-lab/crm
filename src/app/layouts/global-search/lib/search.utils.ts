import React from 'react';

/**
 * Splits text by query matches and wraps matched portions in a highlight span
 */
export function highlightMatches(text: string, query: string): React.ReactNode {
  if (!query || !query.trim() || !text) {
    return text;
  }

  const trimmedQuery = query.trim();
  const escaped = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (part.toLowerCase() === trimmedQuery.toLowerCase()) {
      return React.createElement(
        'mark',
        {
          key: i,
          className: 'bg-indigo-100 text-indigo-950 font-semibold px-0.5 rounded-xs',
        },
        part
      );
    }
    return React.createElement('span', { key: i }, part);
  });
}
