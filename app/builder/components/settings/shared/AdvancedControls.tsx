"use client";

import React from "react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import type { BreakpointKey } from "@/app/builder/contexts/ResponsiveContext";
import type { ContainerProps } from "../../ui/container/types";
import type { ContainerControlActions } from "./types";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "./styles";
import { ResponsiveSpacingControl } from "./StyleControls";

interface AdvancedControlProps {
  props: ContainerProps;
  actions: ContainerControlActions;
  controlId?: string;
}

type ResponsiveRecord = Record<string, unknown>;

export const InfoNotice: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
    <p className="text-xs text-blue-700">{children}</p>
  </div>
);

export const CSSControls: React.FC<AdvancedControlProps> = ({ props, actions, controlId = "css" }) => {
  const baseId = `css-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <div className="space-y-1.5">
        <div className={INLINE_ROW_CLASS}>
          <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-classes`}>
            CSS Classes
          </label>
          <input
            id={`${baseId}-classes`}
            type="text"
            value={props.className || ""}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.className = event.target.value;
              })
            }
            placeholder="custom-class another-class"
            className={INLINE_FIELD_CLASS}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Add custom CSS classes separated by spaces</p>
      </div>

      <div className="space-y-1.5">
        <div className={INLINE_ROW_CLASS}>
          <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-id`}>
            CSS ID
          </label>
          <input
            id={`${baseId}-id`}
            type="text"
            value={props.cssId || ""}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.cssId = event.target.value;
              })
            }
            placeholder="unique-id"
            className={INLINE_FIELD_CLASS}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Unique identifier for this element</p>
      </div>
    </div>
  );
};

export const AttributesControls: React.FC<AdvancedControlProps> = ({ props, actions, controlId = "attributes" }) => {
  const baseId = `attribute-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-data`}>
          Data Attributes
        </label>
        <textarea
          id={`${baseId}-data`}
          value={props.dataAttributes || ""}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.dataAttributes = event.target.value;
            })
          }
          placeholder={"data-scroll=&quot;true&quot;\n" + "data-animation=&quot;fade&quot;"}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">One attribute per line (e.g., data-scroll=&quot;true&quot;)</p>
      </div>

      <div className="space-y-1.5">
        <div className={INLINE_ROW_CLASS}>
          <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-aria`}>
            ARIA Label
          </label>
          <input
            id={`${baseId}-aria`}
            type="text"
            value={props.ariaLabel || ""}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.ariaLabel = event.target.value;
              })
            }
            placeholder="Descriptive label for screen readers"
            className={INLINE_FIELD_CLASS}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Accessibility label for screen readers</p>
      </div>
    </div>
  );
};

export const PositionControls: React.FC<AdvancedControlProps> = ({ props, actions, controlId = "position" }) => {
  const baseId = `position-controls-${controlId}`;
  const { currentBreakpoint } = useResponsive();

  const resolveExistingUnit = () => props.positionTopUnit || props.positionRightUnit || props.positionBottomUnit || props.positionLeftUnit;

  const buildSideRecord = (val?: number | null) => {
    if (val === null || val === undefined) return undefined;
    return { desktop: val } as ResponsiveRecord;
  };

  const offsetsValue: ResponsiveRecord = {};
  const topRecord = buildSideRecord(props.positionTop);
  if (topRecord) offsetsValue.top = topRecord;
  const rightRecord = buildSideRecord(props.positionRight);
  if (rightRecord) offsetsValue.right = rightRecord;
  const bottomRecord = buildSideRecord(props.positionBottom);
  if (bottomRecord) offsetsValue.bottom = bottomRecord;
  const leftRecord = buildSideRecord(props.positionLeft);
  if (leftRecord) offsetsValue.left = leftRecord;

  const existingUnit = resolveExistingUnit();
  if (existingUnit) {
    offsetsValue.unit = { desktop: existingUnit };
  }

  const handleOffsetResponsiveChange = (nextValue: ResponsiveRecord) => {
    const fallbackOrder: BreakpointKey[] = [currentBreakpoint, "desktop", "tablet", "mobile"];

    const getSideValue = (side: "top" | "right" | "bottom" | "left") => {
      const sideRecord = (nextValue?.[side] as Partial<Record<BreakpointKey, number | null>>) || {};
      for (const bp of fallbackOrder) {
        if (sideRecord[bp] !== undefined) {
          const candidate = sideRecord[bp];
          return candidate === null ? null : candidate;
        }
      }
      return null;
    };

    const unitRecord = (nextValue?.unit as Partial<Record<BreakpointKey, string | null>>) || {};
    let unit: string | undefined;
    for (const bp of fallbackOrder) {
      if (unitRecord[bp] !== undefined) {
        unit = unitRecord[bp] ?? undefined;
        break;
      }
    }
    if (!unit) {
      unit = resolveExistingUnit() || "px";
    }

    actions.setProp((draft) => {
      draft.positionTop = getSideValue("top");
      draft.positionRight = getSideValue("right");
      draft.positionBottom = getSideValue("bottom");
      draft.positionLeft = getSideValue("left");

      draft.positionTopUnit = unit;
      draft.positionRightUnit = unit;
      draft.positionBottomUnit = unit;
      draft.positionLeftUnit = unit;
    });
  };

  const handleZIndexChange = (value: string) => {
    actions.setProp((draft) => {
      const parsed = value === "" ? undefined : Number(value);
      draft.zIndex = parsed === undefined || Number.isNaN(parsed) ? undefined : parsed;
    });
  };

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-select`}>
          Position
        </label>
        <select
          id={`${baseId}-select`}
          value={props.position || "default"}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.position = event.target.value;
            })
          }
          className={INLINE_FIELD_CLASS}
        >
          <option value="default">Default</option>
          <option value="static">Static</option>
          <option value="relative">Relative</option>
          <option value="absolute">Absolute</option>
          <option value="fixed">Fixed</option>
          <option value="sticky">Sticky</option>
        </select>
      </div>

      {props.position && props.position !== "default" && props.position !== "static" && (
        <>
          <ResponsiveSpacingControl controlId={`${baseId}-offsets`} label="Offsets" value={Object.keys(offsetsValue).length ? offsetsValue : undefined} onChange={handleOffsetResponsiveChange} unitOptions={["px", "%"]} />

          <div className={INLINE_ROW_CLASS}>
            <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-zindex`}>
              Z-Index
            </label>
            <input id={`${baseId}-zindex`} type="number" value={props.zIndex ?? ""} onChange={(event) => handleZIndexChange(event.target.value)} placeholder="auto" className={INLINE_FIELD_CLASS} />
          </div>

          <InfoNotice>Above setting will take effect only on preview or live page, and not while you&rsquo;re editing.</InfoNotice>
        </>
      )}
    </div>
  );
};

type VisibilityAccessor = "hideOnDesktop" | "hideOnTablet" | "hideOnLandscapeMobile" | "hideOnMobile";

export const ResponsiveControls: React.FC<AdvancedControlProps> = ({ props, actions, controlId = "responsive" }) => {
  const baseId = `responsive-controls-${controlId}`;

  const visibilityToggles: Array<{ id: string; label: string; helper: string; accessor: VisibilityAccessor }> = [
    {
      id: "desktop",
      label: "Hide on Desktop",
      helper: "Hide on screens 1024px and above",
      accessor: "hideOnDesktop",
    },
    {
      id: "tablet",
      label: "Hide on Tablet",
      helper: "Hide on screens 768px to 1023px",
      accessor: "hideOnTablet",
    },
    {
      id: "landscape",
      label: "Hide on Landscape Mobile",
      helper: "Hide on screens 480px to 767px",
      accessor: "hideOnLandscapeMobile",
    },
    {
      id: "mobile",
      label: "Hide on Mobile",
      helper: "Hide on screens below 480px",
      accessor: "hideOnMobile",
    },
  ];

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      {visibilityToggles.map(({ id, label, helper, accessor }) => (
        <div key={id} id={`${baseId}-${id}`} data-component-id={`${baseId}-${id}`}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700" htmlFor={`${baseId}-${id}-toggle`}>
              {label}
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id={`${baseId}-${id}-toggle`}
                type="checkbox"
                checked={Boolean(props[accessor])}
                onChange={(event) =>
                  actions.setProp((draft) => {
                    draft[accessor] = event.target.checked;
                  })
                }
                className="sr-only peer"
              />
              <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600'></div>
            </label>
          </div>
          <p className="text-xs text-gray-500">{helper}</p>
        </div>
      ))}

      <InfoNotice>Above setting will take effect only on preview or live page, and not while you&rsquo;re editing.</InfoNotice>
    </div>
  );
};
