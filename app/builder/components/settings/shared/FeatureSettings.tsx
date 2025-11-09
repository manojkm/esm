import React, { useState } from "react";
import type { FeatureKey, FeatureRegistry } from "./featureRegistry";
import type { ComponentControlActions } from "./types";

export interface FeatureSectionConfig {
  id: string;
  title: string;
  features: FeatureKey[];
  description?: string;
}

interface FeatureSettingsProps<TProps> {
  sections: FeatureSectionConfig[];
  registry: Partial<FeatureRegistry<TProps>>;
  props: TProps;
  actions: ComponentControlActions<TProps>;
  initialOpenSection?: string;
  featureMeta?: Partial<Record<FeatureKey, Record<string, unknown>>>;
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
}: FeatureSettingsProps<TProps>) => {
  const defaultSection = initialOpenSection ?? sections[0]?.id ?? "";
  const [openSection, setOpenSection] = useState<string>(defaultSection);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => {
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
                {section.features.map((featureKey) => {
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
                        meta: featureMeta?.[featureKey],
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

