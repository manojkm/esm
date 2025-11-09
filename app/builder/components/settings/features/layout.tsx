"use client";


import React from "react";
import { LayoutControls as ContainerLayoutControls } from "../shared/LayoutControls";
import type { ContainerProps } from "../../ui/container/types";
import type { ComponentControlActions } from "../shared/types";

/**
 * Thin wrapper around the shared layout controls so they can be declared via feature config.
 */
export interface LayoutFeatureProps extends ContainerProps {}

export interface LayoutControlsProps<TProps extends LayoutFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const LayoutControls = <TProps extends LayoutFeatureProps>({ props, actions, controlId = "layout" }: LayoutControlsProps<TProps>) => {
  const baseId = `layout-feature-${controlId}`;
  const isChildContainer = props.flexBasis !== null && props.flexBasis !== undefined;

  return (
    <section id={baseId} data-component-id={baseId}>
      <ContainerLayoutControls controlId={`${controlId}-layout`} props={props} actions={actions} isChildContainer={isChildContainer} />
    </section>
  );
};

