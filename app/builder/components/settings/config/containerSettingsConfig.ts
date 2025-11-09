import definition from "./container.settings.json";
import type { FeatureSectionConfig } from "../shared/FeatureSettings";

interface ContainerSettingsDefinition {
  style: FeatureSectionConfig[];
  advanced: FeatureSectionConfig[];
}

const containerSettingsDefinition = definition as ContainerSettingsDefinition;

export const containerStyleSettingsConfig = containerSettingsDefinition.style;
export const containerAdvancedSettingsConfig = containerSettingsDefinition.advanced;

