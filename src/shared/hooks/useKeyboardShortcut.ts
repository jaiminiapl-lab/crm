import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  key: string;
  ctrlOrCmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: (e: KeyboardEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = options.ctrlOrCmd ? event.ctrlKey || event.metaKey : true;
      const isShift = options.shift ? event.shiftKey : true;
      const isAlt = options.alt ? event.altKey : true;
      const isKeyMatch = event.key.toLowerCase() === options.key.toLowerCase();

      if (isKeyMatch && isCtrlOrCmd && isShift && isAlt) {
        if (options.preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, callback, enabled]);
}
