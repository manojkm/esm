import { useState, useEffect } from "react";

const STORAGE_KEY_PREFIX = "ebay-builder-tab-state-";

/**
 * Hook to persist tab state across component switches using localStorage
 * @param componentType - The type of component (e.g., "Text", "Container")
 * @param defaultTab - The default tab ID to use if no persisted state exists
 * @returns [activeTab, setActiveTab] - Similar to useState but with persistence
 */
export const usePersistedTabState = <T extends string>(
  componentType: string,
  defaultTab: T
): [T, (tab: T) => void] => {
  const storageKey = `${STORAGE_KEY_PREFIX}${componentType}`;

  const [activeTab, setActiveTab] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultTab;
    }
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return saved as T;
      }
    } catch {
      // Ignore errors, use default
    }
    return defaultTab;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, activeTab);
      } catch {
        // Ignore errors (e.g., quota exceeded)
      }
    }
  }, [activeTab, storageKey]);

  return [activeTab, setActiveTab];
};

