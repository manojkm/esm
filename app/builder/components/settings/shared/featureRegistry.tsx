import React from "react";
import { BackgroundControls, BorderControls, BoxShadowControls, ColorControls, SpacingControls } from "./StyleControls";
import { AttributesControls, CSSControls, PositionControls, ResponsiveControls } from "./AdvancedControls";
import type { ContainerProps } from "../../ui/container/types";
import type { ComponentControlActions } from "./types";

export type FeatureKey =
  | "spacing"
  | "background"
  | "border"
  | "boxShadow"
  | "color"
  | "css"
  | "attributes"
  | "responsive"
  | "position";

export interface FeatureRenderContext<TProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId: string;
}

export type FeatureRenderer<TProps> = (context: FeatureRenderContext<TProps>) => React.ReactNode;

export type FeatureRegistry<TProps> = Record<FeatureKey, FeatureRenderer<TProps>>;

export const containerFeatureRegistry: Partial<FeatureRegistry<ContainerProps>> = {
  spacing: ({ props, actions, controlId }) => <SpacingControls props={props} actions={actions} controlId={`${controlId}-spacing`} />,
  background: ({ props, actions, controlId }) => <BackgroundControls props={props} actions={actions} controlId={`${controlId}-background`} />,
  border: ({ props, actions, controlId }) => <BorderControls props={props} actions={actions} controlId={`${controlId}-border`} />,
  boxShadow: ({ props, actions, controlId }) => <BoxShadowControls props={props} actions={actions} controlId={`${controlId}-box-shadow`} />,
  color: ({ props, actions, controlId }) => <ColorControls props={props} actions={actions} controlId={`${controlId}-color`} />,
  css: ({ props, actions, controlId }) => <CSSControls props={props} actions={actions} controlId={`${controlId}-css`} />,
  attributes: ({ props, actions, controlId }) => <AttributesControls props={props} actions={actions} controlId={`${controlId}-attributes`} />,
  responsive: ({ props, actions, controlId }) => <ResponsiveControls props={props} actions={actions} controlId={`${controlId}-responsive`} />,
  position: ({ props, actions, controlId }) => <PositionControls props={props} actions={actions} controlId={`${controlId}-position`} />,
};

