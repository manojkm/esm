"use client";

import { useEffect, useCallback } from "react";
import { useEditor } from "@craftjs/core";

interface UseKeyboardShortcutsOptions {
  onCopy?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onShowHelp?: () => void;
}

export const useKeyboardShortcuts = (options: UseKeyboardShortcutsOptions = {}) => {
  const { actions, query } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const { onCopy, onDuplicate, onDelete, onShowHelp } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        (target.closest("[contenteditable]") && target.closest("[contenteditable]")?.getAttribute("contenteditable") === "true")
      ) {
        // Allow Escape to work even in inputs
        if (e.key === "Escape") {
          target.blur();
          actions.selectNode();
          e.preventDefault();
        }
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl+Z / Cmd+Z
      if (ctrlOrCmd && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (query.history.canUndo()) {
          actions.history.undo();
        }
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z / Cmd+Shift+Z
      if ((ctrlOrCmd && e.key === "y") || (ctrlOrCmd && e.shiftKey && e.key === "z")) {
        e.preventDefault();
        if (query.history.canRedo()) {
          actions.history.redo();
        }
        return;
      }

      // Copy: Ctrl+C / Cmd+C
      if (ctrlOrCmd && e.key === "c") {
        e.preventDefault();
        onCopy?.();
        return;
      }

      // Paste: Ctrl+V / Cmd+V
      if (ctrlOrCmd && e.key === "v") {
        e.preventDefault();
        // Paste functionality would need to be implemented
        // This is a placeholder - actual paste would require clipboard handling
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if (ctrlOrCmd && e.key === "d") {
        e.preventDefault();
        onDuplicate?.();
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDelete?.();
        return;
      }

      // Escape: Deselect
      if (e.key === "Escape") {
        e.preventDefault();
        actions.selectNode();
        return;
      }

      // Help: ? (when not in input)
      if (e.key === "?" && !ctrlOrCmd && !e.shiftKey) {
        e.preventDefault();
        onShowHelp?.();
        return;
      }
    },
    [actions, query, onCopy, onDuplicate, onDelete, onShowHelp]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};

