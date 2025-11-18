import definition from "./text.settings.json";
import type { FeatureSectionConfig } from "../shared/FeatureSettings";

/**
 * Strongly-typed accessors for the text settings manifest.
 */
interface TextSettingsDefinition {
  general: FeatureSectionConfig[];
  style: FeatureSectionConfig[];
  advanced: FeatureSectionConfig[];
}

const textSettingsDefinition = definition as TextSettingsDefinition;

export const textGeneralSettingsConfig = textSettingsDefinition.general;
export const textStyleSettingsConfig = textSettingsDefinition.style;
export const textAdvancedSettingsConfig = textSettingsDefinition.advanced;

