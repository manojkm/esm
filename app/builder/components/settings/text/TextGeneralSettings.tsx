"use client";

import React from "react";
import { FeatureSettingsAccordion } from "../shared/FeatureSettings";
import { textFeatureRegistry } from "../shared/featureRegistry";
import { textGeneralSettingsConfig } from "../config/textSettingsConfig";
import type { TextProps } from "../../ui/text/types";
import type { ComponentControlActions } from "../shared/types";

interface TextGeneralSettingsProps {
  props: TextProps;
  actions: ComponentControlActions<TextProps>;
}

/**
 * Text-specific wrapper that renders general tab sections via the feature system.
 */
export const TextGeneralSettings: React.FC<TextGeneralSettingsProps> = ({ props, actions }) => (
  <FeatureSettingsAccordion sections={textGeneralSettingsConfig} registry={textFeatureRegistry} props={props} actions={actions} initialOpenSection="general" componentType="Text-General" />
);

