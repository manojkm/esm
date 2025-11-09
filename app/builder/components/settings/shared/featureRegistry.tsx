import React from "react";
import {
  BackgroundControls,
  BorderControls,
  BoxShadowControls,
  ColorControls,
  SpacingControls,
  LayoutControls,
  ContainerChildSizingControls,
  ContainerParentSizingControls,
  MinHeightControls,
  EqualHeightToggle,
  HtmlTagSelect,
  OverflowSelect,
  CssControls,
  AttributesControls,
  PositionControls,
  ResponsiveControls,
} from "../features";
import type { ContainerProps } from "../../ui/container/types";
import type { ComponentControlActions } from "./types";

export type FeatureKey =
  | "spacing"
  | "background"
  | "border"
  | "boxShadow"
  | "color"
  | "layout"
  | "childSizing"
  | "parentSizing"
  | "minHeight"
  | "equalHeight"
  | "htmlTag"
  | "overflow"
  | "css"
  | "attributes"
  | "responsive"
  | "position";

export interface FeatureRenderContext<TProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId: string;
  meta?: Record<string, unknown>;
}

export type FeatureRenderer<TProps> = (context: FeatureRenderContext<TProps>) => React.ReactNode;

export type FeatureRegistry<TProps> = Record<FeatureKey, FeatureRenderer<TProps>>;

/**
 * Utility to build a registry of feature renderers that can be shared across components.
 */
export const createFeatureRegistry = <TProps>(overrides: Partial<FeatureRegistry<TProps>> = {}): Partial<FeatureRegistry<TProps>> => ({
  ...overrides,
});

// Default registry used by the Container component; other components can supply overrides.
export const containerFeatureRegistry: Partial<FeatureRegistry<ContainerProps>> = createFeatureRegistry({
  spacing: ({ props, actions, controlId }) => <SpacingControls props={props} actions={actions} controlId={`${controlId}-spacing`} />,
  background: ({ props, actions, controlId }) => <BackgroundControls props={props} actions={actions} controlId={`${controlId}-background`} />,
  border: ({ props, actions, controlId }) => <BorderControls props={props} actions={actions} controlId={`${controlId}-border`} />,
  boxShadow: ({ props, actions, controlId }) => <BoxShadowControls props={props} actions={actions} controlId={`${controlId}-box-shadow`} />,
  color: ({ props, actions, controlId }) => <ColorControls props={props} actions={actions} controlId={`${controlId}-color`} />,
  layout: ({ props, actions, controlId }) => <LayoutControls props={props} actions={actions} controlId={`${controlId}-layout`} />,
  childSizing: ({ props, actions, controlId }) => <ContainerChildSizingControls props={props} actions={actions} controlId={`${controlId}-child`} />,
  parentSizing: ({ props, actions, controlId }) => <ContainerParentSizingControls props={props} actions={actions} controlId={`${controlId}-parent`} />,
  minHeight: ({ props, actions, controlId }) => <MinHeightControls props={props} actions={actions} controlId={`${controlId}-min-height`} />,
  equalHeight: ({ props, actions, controlId }) => <EqualHeightToggle props={props} actions={actions} controlId={`${controlId}-equal-height`} />,
  htmlTag: ({ props, actions, controlId }) => <HtmlTagSelect props={props} actions={actions} controlId={`${controlId}-html-tag`} />,
  overflow: ({ props, actions, controlId }) => <OverflowSelect props={props} actions={actions} controlId={`${controlId}-overflow`} />,
  css: ({ props, actions, controlId }) => <CssControls props={props} actions={actions} controlId={`${controlId}-css`} />,
  attributes: ({ props, actions, controlId }) => <AttributesControls props={props} actions={actions} controlId={`${controlId}-attributes`} />,
  responsive: ({ props, actions, controlId }) => <ResponsiveControls props={props} actions={actions} controlId={`${controlId}-responsive`} />,
  position: ({ props, actions, controlId }) => <PositionControls props={props} actions={actions} controlId={`${controlId}-position`} />,
});

