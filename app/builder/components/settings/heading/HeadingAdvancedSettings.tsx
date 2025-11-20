"use client";

import React from "react";
import { FeatureSettingsAccordion } from "../shared/FeatureSettings";
import { headingFeatureRegistry } from "../shared/featureRegistry";
import { headingAdvancedSettingsConfig } from "../config/headingSettingsConfig";
import type { HeadingProps } from "../../ui/heading/types";
import type { ComponentControlActions } from "../shared/types";

interface HeadingAdvancedSettingsProps {
  props: HeadingProps;
  actions: ComponentControlActions<HeadingProps>;
}

/**
 * Advanced tab implementation for heading (CSS/attributes/responsive/position).
 */
export const HeadingAdvancedSettings: React.FC<HeadingAdvancedSettingsProps> = ({ props, actions }) => (
  <FeatureSettingsAccordion sections={headingAdvancedSettingsConfig} registry={headingFeatureRegistry} props={props} actions={actions} initialOpenSection="css" componentType="Heading-Advanced" />
);

