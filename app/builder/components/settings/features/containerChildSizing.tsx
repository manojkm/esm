"use client";

import React, { useEffect } from "react";
import { useNode, useEditor } from "@craftjs/core";
import type { ComponentControlActions } from "../shared/types";
import { ResponsiveNumberInput } from "../shared/controls";
import type { ResponsiveRecord } from "../shared/types/responsive";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ContainerProps } from "../../ui/container/types";

/**
 * Feature exposed only when the container is used as a child (column).
 * Wraps width overrides and delegates to shared min-height/equal-height features.
 */

const CHILD_WIDTH_DEFAULTS = {
  "%": 100,
  px: 320,
} as const;

export interface ContainerChildSizingProps extends React.PropsWithChildren {
  flexBasis?: number | null;
  flexBasisUnit?: string;
  flexBasisResponsive?: ResponsiveValue;
}

export interface ContainerChildSizingControlsProps<TProps extends ContainerChildSizingProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

export const ContainerChildSizingControls = <TProps extends ContainerChildSizingProps>({ props, actions, controlId = "child-sizing" }: ContainerChildSizingControlsProps<TProps>) => {
  const isChildContainer = props.flexBasis !== null && props.flexBasis !== undefined;
  const { id } = useNode();
  const { query } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  // Initialize responsive values if not already set
  useEffect(() => {
    if (!isChildContainer) return;

    const responsive = props.flexBasisResponsive;
    const needsDesktop = !responsive || responsive.desktop === undefined;
    const needsTablet = !responsive || responsive.tablet === undefined;
    const needsMobile = !responsive || responsive.mobile === undefined;
    const unitMap = responsive?.unit || {};
    const needsUnitDesktop = !unitMap.desktop;
    const needsUnitTablet = !unitMap.tablet;
    const needsUnitMobile = !unitMap.mobile;

    if (!(needsDesktop || needsTablet || needsMobile || needsUnitDesktop || needsUnitTablet || needsUnitMobile)) {
      return;
    }

    // Check if parent container's flexDirection is "column" on mobile
    let isParentColumnOnMobile = false;
    try {
      const currentNode = query.node(id).get();
      const parentId = currentNode.data.parent;

      if (parentId && parentId !== "ROOT") {
        const parentNode = query.node(parentId).get();
        const parentProps = parentNode.data.props as ContainerProps;

        if (parentProps) {
          const flexDirectionResponsive = parentProps.flexDirectionResponsive;
          const flexDirection = parentProps.flexDirection;
          const mobileFlexDirection = (flexDirectionResponsive?.mobile as string | undefined) ?? flexDirection ?? "row";
          isParentColumnOnMobile = mobileFlexDirection === "column";
        }
      }
    } catch {
      // If we can't access parent, default to false
      isParentColumnOnMobile = false;
    }

    actions.setProp((draft) => {
      const nextResponsive: ResponsiveValue = { ...(draft.flexBasisResponsive as ResponsiveValue | undefined) };
      const fallback = draft.flexBasis ?? (draft.flexBasisUnit === "px" ? 320 : 100);

      // Set mobile default to 100% if parent flexDirection is column on mobile
      const mobileDefault = isParentColumnOnMobile ? 100 : fallback;

      nextResponsive.desktop ??= fallback;
      nextResponsive.tablet ??= fallback;
      nextResponsive.mobile ??= mobileDefault;
      nextResponsive.unit = {
        ...(nextResponsive.unit || {}),
        desktop: nextResponsive.unit?.desktop ?? draft.flexBasisUnit ?? "%",
        tablet: nextResponsive.unit?.tablet ?? draft.flexBasisUnit ?? "%",
        mobile: nextResponsive.unit?.mobile ?? (isParentColumnOnMobile ? "%" : draft.flexBasisUnit ?? "%"),
      };
      draft.flexBasisResponsive = nextResponsive;
    });
  }, [actions, props.flexBasisResponsive, props.flexBasis, props.flexBasisUnit, isChildContainer, id, query]);

  if (!isChildContainer) return null;

  const baseId = `child-sizing-${controlId}`;
  const widthUnit = props.flexBasisUnit ?? "%";
  const widthDefaults = CHILD_WIDTH_DEFAULTS[widthUnit as keyof typeof CHILD_WIDTH_DEFAULTS] ?? CHILD_WIDTH_DEFAULTS["%"];

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <ResponsiveNumberInput
        controlId={`${baseId}-width`}
        label="Custom Width"
        value={props.flexBasisResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.flexBasisResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.flexBasis ?? widthDefaults;
            draft.flexBasis = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.flexBasisUnit = unitRecord.desktop ?? draft.flexBasisUnit ?? "%";
          })
        }
        unitOptions={["%", "px"]}
        defaultValue={widthDefaults}
        minMaxByUnit={{
          "%": { min: 1, max: 100 },
          px: { min: 20, max: 1600 },
        }}
      />
    </div>
  );
};
