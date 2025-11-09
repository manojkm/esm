"use client";

import React from "react";
import { FeatureSettingsAccordion } from "../shared/FeatureSettings";
import { containerFeatureRegistry } from "../shared/featureRegistry";
import { containerGeneralSettingsConfig } from "../config/containerSettingsConfig";
import type { ContainerProps } from "../../ui/container/types";
import type { ContainerControlActions } from "../shared/types";

interface ContainerGeneralSettingsProps {
  props: ContainerProps;
  actions: ContainerControlActions;
}

/**
 * Container-specific wrapper that renders general tab sections via the feature system.
 */
export const ContainerGeneralSettings: React.FC<ContainerGeneralSettingsProps> = ({ props, actions }) => (
  <FeatureSettingsAccordion sections={containerGeneralSettingsConfig} registry={containerFeatureRegistry} props={props} actions={actions} initialOpenSection="containerType" />
);

