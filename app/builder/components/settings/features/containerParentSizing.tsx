"use client";

import React, { useEffect } from "react";
import type { ComponentControlActions } from "../shared/types";
import { ResponsiveNumberInput } from "../shared/controls";
import type { ResponsiveRecord } from "../shared/types/responsive";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";

/**
 * Feature exposed for top-level containers, covering width presets and content box sizing.
 */

export interface ContainerParentSizingProps {
  containerWidth?: string;
  customWidth?: number;
  customWidthUnit?: string;
  customWidthResponsive?: ResponsiveValue;
  contentWidth?: string;
  contentBoxWidth?: number;
  contentBoxWidthUnit?: string;
  flexBasis?: number | null;
  contentBoxWidthResponsive?: ResponsiveValue;
}

export interface ContainerParentSizingControlsProps<TProps extends ContainerParentSizingProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const CUSTOM_WIDTH_CONFIG = {
  unitOptions: [
    { value: "px", label: "px" },
    { value: "%", label: "%" },
  ],
  minMaxByUnit: {
    px: { min: 100, max: 1600 },
    "%": { min: 10, max: 100 },
  },
  defaultValues: {
    px: 1200,
    "%": 100,
  },
};

export const ContainerParentSizingControls = <TProps extends ContainerParentSizingProps>({ props, actions, controlId = "parent-sizing" }: ContainerParentSizingControlsProps<TProps>) => {
  const { settings } = useGlobalSettings();
  const isChildContainer = props.flexBasis !== undefined && props.flexBasis !== null;

  useEffect(() => {
    if (isChildContainer) return;

    const responsive = props.contentBoxWidthResponsive;
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

    // Content box width is for content wrappers (Full Width + Content Width = Boxed), NOT for Container Width = Boxed
    // So it should NOT use global boxed max-width
    actions.setProp((draft) => {
      const nextResponsive: ResponsiveValue = { ...(draft.contentBoxWidthResponsive as ResponsiveValue | undefined) };
      nextResponsive.desktop ??= draft.contentBoxWidth ?? 1200;
      nextResponsive.tablet ??= 1024;
      nextResponsive.mobile ??= 767;
      nextResponsive.unit = {
        ...(nextResponsive.unit || {}),
        desktop: nextResponsive.unit?.desktop ?? draft.contentBoxWidthUnit ?? "px",
        tablet: nextResponsive.unit?.tablet ?? "px",
        mobile: nextResponsive.unit?.mobile ?? "px",
      };
      draft.contentBoxWidthResponsive = nextResponsive;
    });
  }, [actions, isChildContainer, props.contentBoxWidthResponsive, props.contentBoxWidth, props.contentBoxWidthUnit]);

  useEffect(() => {
    if (isChildContainer || props.containerWidth !== "custom") return;

    const responsive = props.customWidthResponsive;
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

    const globalCustomWidth = settings.containerDefaults.maxWidth?.custom ?? 100;

    actions.setProp((draft) => {
      const nextResponsive: ResponsiveValue = { ...(draft.customWidthResponsive as ResponsiveValue | undefined) };
      const fallback = draft.customWidth ?? (draft.customWidthUnit === "px" ? 1200 : globalCustomWidth);
      nextResponsive.desktop ??= fallback;
      nextResponsive.tablet ??= globalCustomWidth;
      nextResponsive.mobile ??= globalCustomWidth;
      nextResponsive.unit = {
        ...(nextResponsive.unit || {}),
        desktop: nextResponsive.unit?.desktop ?? draft.customWidthUnit ?? "%",
        tablet: nextResponsive.unit?.tablet ?? "%",
        mobile: nextResponsive.unit?.mobile ?? "%",
      };
      draft.customWidthResponsive = nextResponsive;
    });
  }, [actions, isChildContainer, props.containerWidth, props.customWidthResponsive, props.customWidth, props.customWidthUnit, settings.containerDefaults.maxWidth?.custom]);

  if (isChildContainer) return null;

  const baseId = `parent-sizing-${controlId}`;

  const renderContainerWidthButtons = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Container Width</label>
      <div className="grid grid-cols-3 gap-1">
        {["full", "boxed", "custom"].map((width) => (
          <button
            key={width}
            type="button"
            onClick={() =>
              actions.setProp((draft) => {
                draft.containerWidth = width;
              })
            }
            className={`px-3 py-2 text-xs border rounded capitalize ${(props.containerWidth || "full") === width ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
          >
            {width === "full" ? "Full Width" : width}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCustomWidthControl = () => {
    if (props.containerWidth !== "custom") return null;

    const globalCustomWidth = settings.containerDefaults.maxWidth?.custom ?? 100;

    return (
      <ResponsiveNumberInput
        controlId={`${baseId}-custom`}
        label="Custom Width"
        value={props.customWidthResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.customWidthResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.customWidth ?? globalCustomWidth;
            draft.customWidth = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.customWidthUnit = unitRecord.desktop ?? draft.customWidthUnit ?? "%";
          })
        }
        unitOptions={["%", "px"]}
        defaultValue={globalCustomWidth}
        minMaxByUnit={CUSTOM_WIDTH_CONFIG.minMaxByUnit}
      />
    );
  };

  const renderContentWidthButtons = () => {
    if (props.containerWidth !== "full" && props.containerWidth) return null;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content Width</label>
        <div className="grid grid-cols-2 gap-1">
          {["boxed", "full"].map((contentWidth) => (
            <button
              key={contentWidth}
              type="button"
              onClick={() =>
                actions.setProp((draft) => {
                  draft.contentWidth = contentWidth;
                })
              }
              className={`px-3 py-2 text-xs border rounded capitalize ${(props.contentWidth || "boxed") === contentWidth ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            >
              {contentWidth === "full" ? "Full Width" : "Boxed"}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderContentBoxWidth = () => {
    if ((props.containerWidth !== "full" && props.containerWidth) || (props.contentWidth !== "boxed" && props.contentWidth)) return null;

    return (
      <ResponsiveNumberInput
        controlId={`${baseId}-content-box`}
        label="Content Box Width"
        value={props.contentBoxWidthResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.contentBoxWidthResponsive = value as ResponsiveValue;
            const record = value as ResponsiveRecord;
            const fallback = (record.desktop as number | undefined) ?? (record.tablet as number | undefined) ?? (record.mobile as number | undefined) ?? draft.contentBoxWidth ?? 1200;
            draft.contentBoxWidth = fallback;
            const unitRecord = (record.unit as Record<string, string>) || {};
            draft.contentBoxWidthUnit = unitRecord.desktop ?? draft.contentBoxWidthUnit ?? "px";
          })
        }
        unitOptions={["px", "%"]}
        defaultValue={1200}
        minMaxByUnit={CUSTOM_WIDTH_CONFIG.minMaxByUnit}
      />
    );
  };

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {renderContainerWidthButtons()}
      {renderCustomWidthControl()}
      {renderContentWidthButtons()}
      {renderContentBoxWidth()}
    </div>
  );
};
