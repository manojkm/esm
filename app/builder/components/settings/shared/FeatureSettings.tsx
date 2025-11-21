import React from "react";
import type { FeatureKey, FeatureRegistry } from "./featureRegistry";
import type { ComponentControlActions } from "./types";
import { usePersistedAccordionState } from "../../../hooks/usePersistedAccordionState";

export interface FeatureConfigEntry {
  feature: FeatureKey;
  meta?: Record<string, unknown>;
}

export interface FeatureSectionConfig {
  id: string;
  title: string;
  features: Array<FeatureKey | FeatureConfigEntry>;
  description?: string;
  condition?: (props: any) => boolean; // Optional condition to show/hide section
}

interface FeatureSettingsProps<TProps> {
  sections: FeatureSectionConfig[];
  registry: Partial<FeatureRegistry<TProps>>;
  props: TProps;
  actions: ComponentControlActions<TProps>;
  initialOpenSection?: string;
  featureMeta?: Partial<Record<FeatureKey, Record<string, unknown>>>;
  componentType?: string; // Component type for persistence (e.g., "Text", "Container")
}

/**
 * Generic accordion renderer that maps section config to registered feature controls.
 * Keeps the settings UI declarative and re-usable across components.
 */
export const FeatureSettingsAccordion = <TProps,>({
  sections,
  registry,
  props,
  actions,
  initialOpenSection,
  featureMeta,
  componentType = "Component", // Default component type if not provided
}: FeatureSettingsProps<TProps>) => {
  const defaultSection = initialOpenSection ?? sections[0]?.id ?? "";
  const [openSection, setOpenSection] = usePersistedAccordionState(`${componentType}-Accordion`, defaultSection);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? "" : id);
  };

  return (
    <div className="space-y-4">
      {sections
        .filter((section) => {
          // If condition is provided, check it; otherwise always show
          return section.condition ? section.condition(props) : true;
        })
        .map((section) => {
        const isOpen = openSection === section.id;
        return (
          <div key={section.id} className="border border-gray-200 rounded-md">
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span>{section.title}</span>
              <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
            </button>
            {isOpen && (
              <div className="p-4 border-t border-gray-200 space-y-4">
                {section.description && <p className="text-xs text-gray-500">{section.description}</p>}
                {section.features.map((featureItem) => {
                  const isObject = typeof featureItem === "object";
                  const featureKey = (isObject ? (featureItem as FeatureConfigEntry).feature : featureItem) as FeatureKey;
                  const metaFromConfig = isObject ? (featureItem as FeatureConfigEntry).meta : undefined;
                  const meta = {
                    ...(featureMeta?.[featureKey] ?? {}),
                    ...(metaFromConfig ?? {}),
                  };

                  const renderer = registry[featureKey];
                  if (!renderer) {
                    console.warn(`Feature "${featureKey}" is not registered. Skipping.`);
                    return null;
                  }

                  return (
                    <div key={`${section.id}-${featureKey}`}>
                      {renderer({
                        props,
                        actions,
                        controlId: `${section.id}-${featureKey}`,
                        meta,
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

