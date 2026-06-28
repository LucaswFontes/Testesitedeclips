'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsConfig {
  onCreateNew?: () => void;
  onFocusSearch?: () => void;
  onCloseDialog?: () => void;
}

export function useKeyboardShortcuts({
  onCreateNew,
  onFocusSearch,
  onCloseDialog,
}: KeyboardShortcutsConfig) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // CTRL + N - Create new clip
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        onCreateNew?.();
        return;
      }

      // CTRL + F - Focus search
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        onFocusSearch?.();
        return;
      }

      // ESC - Close dialog
      if (e.key === 'Escape') {
        onCloseDialog?.();
        return;
      }
    },
    [onCreateNew, onFocusSearch, onCloseDialog]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
