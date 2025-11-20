"use client";

import React from "react";
import { FeatureSettingsAccordion } from "../shared/FeatureSettings";
import { headingFeatureRegistry } from "../shared/featureRegistry";
import { headingGeneralSettingsConfig } from "../config/headingSettingsConfig";
import type { HeadingProps } from "../../ui/heading/types";
import type { ComponentControlActions } from "../shared/types";

interface HeadingGeneralSettingsProps {
  props: HeadingProps;
  actions: ComponentControlActions<HeadingProps>;
}

/**
 * Heading-specific wrapper that renders general tab sections via the feature system.
 */
export const HeadingGeneralSettings: React.FC<HeadingGeneralSettingsProps> = ({ props, actions }) => (
  <FeatureSettingsAccordion sections={headingGeneralSettingsConfig} registry={headingFeatureRegistry} props={props} actions={actions} initialOpenSection="content" componentType="Heading-General" />
);

