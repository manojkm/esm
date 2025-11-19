import React from "react";
import { FeatureSettingsAccordion } from "../shared/FeatureSettings";
import { containerFeatureRegistry } from "../shared/featureRegistry";
import { containerStyleSettingsConfig } from "../config/containerSettingsConfig";
import type { ContainerProps } from "../../ui/container/types";
import type { ContainerControlActions } from "../shared/types";

interface ContainerStyleSettingsProps {
  props: ContainerProps;
  actions: ContainerControlActions;
}

/**
 * Style tab implementation for containers (spacing/background/border/etc.).
 */
export const ContainerStyleSettings: React.FC<ContainerStyleSettingsProps> = ({ props, actions }) => (
  <FeatureSettingsAccordion
    sections={containerStyleSettingsConfig}
    registry={containerFeatureRegistry}
    props={props}
    actions={actions}
    initialOpenSection="spacing"
    componentType="Container-Style"
  />
);


