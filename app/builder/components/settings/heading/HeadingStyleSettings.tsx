"use client";

import React from "react";
import { FeatureSettingsAccordion } from "../shared/FeatureSettings";
import { headingFeatureRegistry } from "../shared/featureRegistry";
import { headingStyleSettingsConfig } from "../config/headingSettingsConfig";
import type { HeadingProps } from "../../ui/heading/types";
import type { ComponentControlActions } from "../shared/types";

interface HeadingStyleSettingsProps {
  props: HeadingProps;
  actions: ComponentControlActions<HeadingProps>;
}

/**
 * Style tab implementation for heading (typography/spacing/background/separator/etc.).
 */
export const HeadingStyleSettings: React.FC<HeadingStyleSettingsProps> = ({ props, actions }) => (
  <FeatureSettingsAccordion
    sections={headingStyleSettingsConfig}
    registry={headingFeatureRegistry}
    props={props}
    actions={actions}
    initialOpenSection="heading"
    componentType="Heading-Style"
  />
);

