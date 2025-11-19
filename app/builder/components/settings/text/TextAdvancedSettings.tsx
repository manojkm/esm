"use client";

import React from "react";
import { FeatureSettingsAccordion } from "../shared/FeatureSettings";
import { textFeatureRegistry } from "../shared/featureRegistry";
import { textAdvancedSettingsConfig } from "../config/textSettingsConfig";
import type { TextProps } from "../../ui/text/types";
import type { ComponentControlActions } from "../shared/types";

interface TextAdvancedSettingsProps {
  props: TextProps;
  actions: ComponentControlActions<TextProps>;
}

/**
 * Advanced tab wrapper that wires the registry configuration into the accordion renderer.
 */
export const TextAdvancedSettings: React.FC<TextAdvancedSettingsProps> = ({ props, actions }) => (
  <FeatureSettingsAccordion
    sections={textAdvancedSettingsConfig}
    registry={textFeatureRegistry}
    props={props}
    actions={actions}
    initialOpenSection="css"
    componentType="Text-Advanced"
  />
);

