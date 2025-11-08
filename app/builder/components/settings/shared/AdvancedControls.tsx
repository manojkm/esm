import React from "react";
import type { ContainerProps } from "../../ui/Container";
import type { ContainerControlActions } from "./types";

interface AdvancedControlProps {
  props: ContainerProps;
  actions: ContainerControlActions;
  controlId?: string;
}

export const InfoNotice: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
    <p className="text-xs text-blue-700">{children}</p>
  </div>
);

export const CSSControls: React.FC<AdvancedControlProps> = ({ props, actions, controlId = "css" }) => {
  const baseId = `css-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-classes`}>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        />
        <p className="text-xs text-gray-500 mt-1">Add custom CSS classes separated by spaces</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-id`}>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        />
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-aria`}>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        />
        <p className="text-xs text-gray-500 mt-1">Accessibility label for screen readers</p>
      </div>
    </div>
  );
};

export const PositionControls: React.FC<AdvancedControlProps> = ({ props, actions, controlId = "position" }) => {
  const baseId = `position-controls-${controlId}`;

  const handleOffsetChange = (side: "Top" | "Right" | "Bottom" | "Left", value: string) => {
    const parsed = value === "" ? null : Number(value);

    actions.setProp((draft) => {
      const normalizedValue = parsed === null || Number.isNaN(parsed) ? null : parsed;

      switch (side) {
        case "Top":
          draft.positionTop = normalizedValue;
          break;
        case "Right":
          draft.positionRight = normalizedValue;
          break;
        case "Bottom":
          draft.positionBottom = normalizedValue;
          break;
        case "Left":
          draft.positionLeft = normalizedValue;
          break;
      }
    });
  };

  const handleUnitChange = (side: "Top" | "Right" | "Bottom" | "Left", unit: string) => {
    actions.setProp((draft) => {
      switch (side) {
        case "Top":
          draft.positionTopUnit = unit;
          break;
        case "Right":
          draft.positionRightUnit = unit;
          break;
        case "Bottom":
          draft.positionBottomUnit = unit;
          break;
        case "Left":
          draft.positionLeftUnit = unit;
          break;
      }
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-select`}>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm"
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
          <div className="grid grid-cols-2 gap-3">
            {(["Top", "Right", "Bottom", "Left"] as const).map((side) => {
              const lower = side.toLowerCase();
              return (
                <div key={side}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`${baseId}-${lower}-value`}>
                    {side}
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      id={`${baseId}-${lower}-value`}
                      type="number"
                      value={
                        {
                          Top: props.positionTop,
                          Right: props.positionRight,
                          Bottom: props.positionBottom,
                          Left: props.positionLeft,
                        }[side] ?? ""
                      }
                      onChange={(event) => handleOffsetChange(side, event.target.value)}
                      placeholder="0"
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white"
                    />
                    <select
                      id={`${baseId}-${lower}-unit`}
                      value={
                        {
                          Top: props.positionTopUnit,
                          Right: props.positionRightUnit,
                          Bottom: props.positionBottomUnit,
                          Left: props.positionLeftUnit,
                        }[side] || "px"
                      }
                      onChange={(event) => handleUnitChange(side, event.target.value)}
                      className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white"
                    >
                      <option value="px">px</option>
                      <option value="%">%</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`${baseId}-zindex`}>
              Z-Index
            </label>
            <input id={`${baseId}-zindex`} type="number" value={props.zIndex ?? ""} onChange={(event) => handleZIndexChange(event.target.value)} placeholder="auto" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
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
