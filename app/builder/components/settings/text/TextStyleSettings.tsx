"use client";

import React from "react";
import { FeatureSettingsAccordion } from "../shared/FeatureSettings";
import { textFeatureRegistry } from "../shared/featureRegistry";
import { textStyleSettingsConfig } from "../config/textSettingsConfig";
import type { TextProps } from "../../ui/text/types";
import type { ComponentControlActions } from "../shared/types";

interface TextStyleSettingsProps {
  props: TextProps;
  actions: ComponentControlActions<TextProps>;
}

/**
 * Style tab implementation for text (typography/spacing/background/border/etc.).
 */
export const TextStyleSettings: React.FC<TextStyleSettingsProps> = ({ props, actions }) => (
  <FeatureSettingsAccordion
    sections={textStyleSettingsConfig}
    registry={textFeatureRegistry}
    props={props}
    actions={actions}
    initialOpenSection="typography"
    componentType="Text-Style"
  />
);

