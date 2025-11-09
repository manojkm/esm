import React from "react";
import { FeatureSettingsAccordion } from "../shared/FeatureSettings";
import { containerFeatureRegistry } from "../shared/featureRegistry";
import { containerAdvancedSettingsConfig } from "../config/containerSettingsConfig";
import type { ContainerProps } from "../../ui/container/types";
import type { ContainerControlActions } from "../shared/types";

interface ContainerAdvancedSettingsProps {
  props: ContainerProps;
  actions: ContainerControlActions;
}

export const ContainerAdvancedSettings: React.FC<ContainerAdvancedSettingsProps> = ({ props, actions }) => (
  <FeatureSettingsAccordion
    sections={containerAdvancedSettingsConfig}
    registry={containerFeatureRegistry}
    props={props}
    actions={actions}
    initialOpenSection="css"
  />
);
