"use client";

import React, { useEffect } from "react";
import type { ContainerProps } from "../../ui/container/types";
import type { ContainerControlActions } from "./types";
import { ResponsiveSelectControl } from "../shared/controls";
import type { ResponsiveRecord } from "../shared/types/responsive";

interface LayoutControlsProps {
  props: ContainerProps;
  actions: ContainerControlActions;
  controlId: string;
  isChildContainer: boolean;
}

const layoutTypeOptions = [
  { value: "block", label: "Block" },
  { value: "flex", label: "Flex" },
];

const directionOptions = [
  { value: "row", label: "Row" },
  { value: "column", label: "Column" },
  { value: "row-reverse", label: "Row Reverse" },
  { value: "column-reverse", label: "Column Reverse" },
];

const justifyContentOptions = [
  { value: "flex-start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "flex-end", label: "End" },
  { value: "space-between", label: "Space Between" },
  { value: "space-around", label: "Space Around" },
  { value: "space-evenly", label: "Space Evenly" },
];

const alignItemsOptions = [
  { value: "stretch", label: "Stretch" },
  { value: "flex-start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "flex-end", label: "End" },
  { value: "baseline", label: "Baseline" },
];

const wrapOptions = [
  { value: "nowrap", label: "No Wrap" },
  { value: "wrap", label: "Wrap" },
  { value: "wrap-reverse", label: "Wrap Reverse" },
];

const ensureResponsiveDefaults = (actions: ContainerControlActions, isChildContainer: boolean) => {
  actions.setProp((draft: ContainerProps) => {
    const directionDefault = isChildContainer ? "column" : "row";

    if (draft.flexDirection === undefined) {
      draft.flexDirection = directionDefault;
    }

    if (draft.justifyContent === undefined) {
      draft.justifyContent = "center";
    }

    if (draft.alignItems === undefined) {
      draft.alignItems = "center";
    }

    if (draft.flexWrap === undefined) {
      draft.flexWrap = "nowrap";
    }
  });
};

export const LayoutControls: React.FC<LayoutControlsProps> = ({ controlId, props, actions, isChildContainer }) => {
  useEffect(() => {
    ensureResponsiveDefaults(actions, isChildContainer);
  }, [
    actions,
    isChildContainer,
    props.flexDirection,
    props.alignItems,
    props.justifyContent,
    props.flexWrap,
  ]);

  const baseId = `layout-controls-${controlId}`;
  const layoutValue = props.layout || (isChildContainer ? "flex" : "block");

  const updateResponsiveString = (
    responsiveKey: keyof ContainerProps,
    baseKey: keyof ContainerProps,
    record: ResponsiveRecord,
    fallback: string,
  ) => {
    actions.setProp((draft: ContainerProps) => {
      if (Object.keys(record).length === 0) {
        draft[responsiveKey] = undefined as unknown as ContainerProps[typeof responsiveKey];
      } else {
        draft[responsiveKey] = record as unknown as ContainerProps[typeof responsiveKey];
      }
      const responsive = record;
      const desktopValue =
        (responsive.desktop as string | undefined) ??
        (responsive.tablet as string | undefined) ??
        (responsive.mobile as string | undefined) ??
        fallback;
      draft[baseKey] = desktopValue as unknown as ContainerProps[typeof baseKey];
    });
  };

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <section id={`${baseId}-type`}>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-type-buttons`}>
          Layout Type
        </label>
        <div id={`${baseId}-type-buttons`} className="grid grid-cols-2 gap-1">
          {layoutTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              data-component-id={`${baseId}-type-${option.value}`}
              onClick={() =>
                actions.setProp((draft) => {
                  draft.layout = option.value;
                })
              }
              className={`px-3 py-2 text-xs border rounded capitalize ${
                layoutValue === option.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              aria-pressed={layoutValue === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {layoutValue === "flex" && (
        <div className="space-y-4">
          <ResponsiveSelectControl
            controlId={`${controlId}-direction`}
            label="Direction"
            options={directionOptions}
            value={props.flexDirectionResponsive as ResponsiveRecord | undefined}
            defaultValue={isChildContainer ? "column" : "row"}
            defaultValues={!isChildContainer ? { mobile: "column" } : undefined}
            onChange={(record) => updateResponsiveString("flexDirectionResponsive", "flexDirection", record, isChildContainer ? "column" : "row")}
          />
          <ResponsiveSelectControl
            controlId={`${controlId}-justify`}
            label="Justify Content"
            options={justifyContentOptions}
            value={props.justifyContentResponsive as ResponsiveRecord | undefined}
            defaultValue="center"
            onChange={(record) => updateResponsiveString("justifyContentResponsive", "justifyContent", record, "center")}
          />
          <ResponsiveSelectControl
            controlId={`${controlId}-align`}
            label="Align Items"
            options={alignItemsOptions}
            value={props.alignItemsResponsive as ResponsiveRecord | undefined}
            defaultValue="center"
            onChange={(record) => updateResponsiveString("alignItemsResponsive", "alignItems", record, "center")}
          />
          <ResponsiveSelectControl
            controlId={`${controlId}-wrap`}
            label="Wrap"
            options={wrapOptions}
            value={props.flexWrapResponsive as ResponsiveRecord | undefined}
            defaultValue="nowrap"
            defaultValues={{ mobile: "wrap" }}
            onChange={(record) => updateResponsiveString("flexWrapResponsive", "flexWrap", record, "nowrap")}
          />
        </div>
      )}
    </div>
  );
};

