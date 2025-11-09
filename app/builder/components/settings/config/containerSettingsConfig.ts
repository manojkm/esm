import definition from "./container.settings.json";
import type { FeatureSectionConfig } from "../shared/FeatureSettings";

/**
 * Strongly-typed accessors for the container settings manifest.
 */
interface ContainerSettingsDefinition {
  general: FeatureSectionConfig[];
  style: FeatureSectionConfig[];
  advanced: FeatureSectionConfig[];
}

const containerSettingsDefinition = definition as ContainerSettingsDefinition;

export const containerGeneralSettingsConfig = containerSettingsDefinition.general;
export const containerStyleSettingsConfig = containerSettingsDefinition.style;
export const containerAdvancedSettingsConfig = containerSettingsDefinition.advanced;

