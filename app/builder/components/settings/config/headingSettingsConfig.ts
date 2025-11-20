import definition from "./heading.settings.json";
import type { FeatureSectionConfig } from "../shared/FeatureSettings";

/**
 * Strongly-typed accessors for the heading settings manifest.
 */
interface HeadingSettingsDefinition {
  general: FeatureSectionConfig[];
  style: FeatureSectionConfig[];
  advanced: FeatureSectionConfig[];
}

const headingSettingsDefinition = definition as HeadingSettingsDefinition;

export const headingGeneralSettingsConfig = headingSettingsDefinition.general;
export const headingStyleSettingsConfig = headingSettingsDefinition.style;
export const headingAdvancedSettingsConfig = headingSettingsDefinition.advanced;

