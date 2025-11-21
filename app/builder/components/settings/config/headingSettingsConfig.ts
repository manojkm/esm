import definition from "./heading.settings.json";
import type { FeatureSectionConfig } from "../shared/FeatureSettings";
import type { HeadingProps } from "../../ui/heading/types";

/**
 * Strongly-typed accessors for the heading settings manifest.
 */
interface HeadingSettingsDefinition {
  general: FeatureSectionConfig[];
  style: FeatureSectionConfig[];
  advanced: FeatureSectionConfig[];
}

const headingSettingsDefinition = definition as HeadingSettingsDefinition;

// General tab: Always show all sections (users need to be able to enable/disable features)
// No conditions needed here - users should always see these options
const headingGeneralSettingsConfigWithConditions: FeatureSectionConfig[] = headingSettingsDefinition.general;

const headingStyleSettingsConfigWithConditions: FeatureSectionConfig[] = headingSettingsDefinition.style.map((section) => {
  if (section.id === "separator") {
    return {
      ...section,
      condition: (props: HeadingProps) => props.separatorStyle !== undefined && props.separatorStyle !== "none",
    };
  }
  if (section.id === "subHeading") {
    return {
      ...section,
      condition: (props: HeadingProps) => props.enableSubHeading === true,
    };
  }
  return section;
});

export const headingGeneralSettingsConfig = headingGeneralSettingsConfigWithConditions;
export const headingStyleSettingsConfig = headingStyleSettingsConfigWithConditions;
export const headingAdvancedSettingsConfig = headingSettingsDefinition.advanced;

