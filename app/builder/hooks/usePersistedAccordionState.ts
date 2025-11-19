import { useState, useEffect } from "react";

const STORAGE_KEY_PREFIX = "ebay-builder-accordion-state-";

/**
 * Hook to persist accordion section state across component switches using localStorage
 * @param componentType - The type of component (e.g., "Text", "Container")
 * @param defaultSection - The default section ID to use if no persisted state exists
 * @returns [openSection, setOpenSection] - Similar to useState but with persistence
 */
export const usePersistedAccordionState = (
  componentType: string,
  defaultSection: string
): [string, (section: string) => void] => {
  const storageKey = `${STORAGE_KEY_PREFIX}${componentType}`;

  const [openSection, setOpenSection] = useState<string>(() => {
    if (typeof window === "undefined") {
      return defaultSection;
    }
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return saved;
      }
    } catch {
      // Ignore errors, use default
    }
    return defaultSection;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, openSection);
      } catch {
        // Ignore errors (e.g., quota exceeded)
      }
    }
  }, [openSection, storageKey]);

  return [openSection, setOpenSection];
};

