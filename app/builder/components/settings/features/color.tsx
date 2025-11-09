"use client";

import React from "react";
import { ColorInput } from "../shared/controls";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

/**
 * Offers responsive text and link color settings in a shared bundle.
 */

export interface ColorFeatureProps {
  textColorResponsive?: ResponsiveValue;
  linkColorResponsive?: ResponsiveValue;
  linkColorHoverResponsive?: ResponsiveValue;
}

export interface ColorControlsProps<TProps extends ColorFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const TextColorControl = <TProps extends ColorFeatureProps>({ props, actions, controlId = "color-text" }: ColorControlsProps<TProps>) => {
  const baseId = `text-color-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <ColorInput
        label="Text Color"
        value={props.textColorResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.textColorResponsive = value as ResponsiveValue;
          })
        }
        placeholder="#000000 or inherit"
        responsive
      />
    </section>
  );
};

const LinkColorControl = <TProps extends ColorFeatureProps>({ props, actions, controlId = "color-link" }: ColorControlsProps<TProps>) => {
  const baseId = `link-color-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <ColorInput
        label="Link Color"
        value={props.linkColorResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.linkColorResponsive = value as ResponsiveValue;
          })
        }
        placeholder="#0066cc or inherit"
        responsive
      />
      <ColorInput
        label="Link Hover Color"
        value={props.linkColorHoverResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.linkColorHoverResponsive = value as ResponsiveValue;
          })
        }
        placeholder="#004499 or inherit"
        responsive
      />
    </section>
  );
};

export const ColorControls = <TProps extends ColorFeatureProps>({ props, actions, controlId = "color" }: ColorControlsProps<TProps>) => {
  const baseId = `color-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <TextColorControl props={props} actions={actions} controlId={`${controlId}-text`} />
      <LinkColorControl props={props} actions={actions} controlId={`${controlId}-link`} />
    </div>
  );
};
