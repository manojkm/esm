"use client";

import React from "react";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "../shared/styles";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";

/**
 * Handles box shadow presets plus normal/hover overrides.
 * Encapsulates toggles, numeric sliders, and color pickers for reuse.
 */

export interface BoxShadowFeatureProps {
  enableBoxShadow?: boolean;
  boxShadowPreset?: string | null;
  boxShadowHorizontal?: number;
  boxShadowVertical?: number;
  boxShadowBlur?: number;
  boxShadowSpread?: number;
  boxShadowPosition?: string | null;
  boxShadowColor?: string | null;
  boxShadowHorizontalResponsive?: ResponsiveValue;
  boxShadowVerticalResponsive?: ResponsiveValue;
  boxShadowBlurResponsive?: ResponsiveValue;
  boxShadowSpreadResponsive?: ResponsiveValue;
  enableBoxShadowHover?: boolean;
  boxShadowHorizontalHover?: number;
  boxShadowVerticalHover?: number;
  boxShadowBlurHover?: number;
  boxShadowSpreadHover?: number;
  boxShadowPositionHover?: string | null;
  boxShadowColorHover?: string | null;
  boxShadowHorizontalHoverResponsive?: ResponsiveValue;
  boxShadowVerticalHoverResponsive?: ResponsiveValue;
  boxShadowBlurHoverResponsive?: ResponsiveValue;
  boxShadowSpreadHoverResponsive?: ResponsiveValue;
}

export interface BoxShadowControlsProps<TProps extends BoxShadowFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({ id, label, value, min, max, step = 1, onChange }) => (
  <div className={INLINE_ROW_CLASS}>
    <label className={INLINE_LABEL_CLASS} htmlFor={id}>
      {label}
    </label>
    <input id={id} type="number" value={value} min={min} max={max} step={step} onChange={onChange} className={INLINE_FIELD_CLASS} />
  </div>
);

const BoxShadowPresetControl = <TProps extends BoxShadowFeatureProps>({ props, actions, controlId = "box-shadow-preset" }: BoxShadowControlsProps<TProps>) => {
  const baseId = `box-shadow-preset-${controlId}`;
  const presets = [
    { name: "None", value: null, shadow: "none" },
    { name: "Subtle", value: "subtle", shadow: "0 1px 3px rgba(0,0,0,0.1)" },
    { name: "Small", value: "small", shadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" },
    { name: "Medium", value: "medium", shadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)" },
    { name: "Large", value: "large", shadow: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)" },
    { name: "Extra Large", value: "xl", shadow: "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)" },
  ];

  const applyPreset = (presetValue: string | null) => {
    actions.setProp((draft) => {
      draft.boxShadowPreset = presetValue;
      if (presetValue !== null) {
        draft.enableBoxShadow = true;
        draft.enableBoxShadowHover = true;
      }
      draft.boxShadowHorizontal = 0;
      draft.boxShadowVertical = 0;
      draft.boxShadowBlur = 0;
      draft.boxShadowSpread = 0;
      draft.boxShadowHorizontalHover = 0;
      draft.boxShadowVerticalHover = 0;
      draft.boxShadowBlurHover = 0;
      draft.boxShadowSpreadHover = 0;
      draft.boxShadowHorizontalResponsive = undefined;
      draft.boxShadowVerticalResponsive = undefined;
      draft.boxShadowBlurResponsive = undefined;
      draft.boxShadowSpreadResponsive = undefined;
      draft.boxShadowHorizontalHoverResponsive = undefined;
      draft.boxShadowVerticalHoverResponsive = undefined;
      draft.boxShadowBlurHoverResponsive = undefined;
      draft.boxShadowSpreadHoverResponsive = undefined;
      draft.boxShadowColor = "rgba(0, 0, 0, 0.1)";
      draft.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";

      switch (presetValue) {
        case null:
          break;
        case "subtle":
          draft.boxShadowVertical = 1;
          draft.boxShadowBlur = 3;
          draft.boxShadowVerticalHover = 2;
          draft.boxShadowBlurHover = 6;
          draft.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
          break;
        case "small":
          draft.boxShadowVertical = 1;
          draft.boxShadowBlur = 3;
          draft.boxShadowVerticalHover = 4;
          draft.boxShadowBlurHover = 8;
          draft.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
          break;
        case "medium":
          draft.boxShadowVertical = 4;
          draft.boxShadowBlur = 6;
          draft.boxShadowVerticalHover = 8;
          draft.boxShadowBlurHover = 15;
          draft.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
          break;
        case "large":
          draft.boxShadowVertical = 10;
          draft.boxShadowBlur = 15;
          draft.boxShadowVerticalHover = 15;
          draft.boxShadowBlurHover = 25;
          draft.boxShadowColorHover = "rgba(0, 0, 0, 0.2)";
          break;
        case "xl":
          draft.boxShadowVertical = 20;
          draft.boxShadowBlur = 25;
          draft.boxShadowVerticalHover = 25;
          draft.boxShadowBlurHover = 50;
          draft.boxShadowColorHover = "rgba(0, 0, 0, 0.25)";
          break;
      }
    });
  };

  return (
    <section id={baseId} data-component-id={baseId}>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-buttons`}>
        Select Preset
      </label>
      <div id={`${baseId}-buttons`} className="grid grid-cols-3 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value ?? "none"}
            type="button"
            data-component-id={`${baseId}-${preset.value ?? "none"}`}
            onClick={() => applyPreset(preset.value)}
            className={`p-3 text-xs border rounded text-center transition-colors ${(props.boxShadowPreset || null) === preset.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            style={{ boxShadow: preset.shadow }}
            aria-pressed={(props.boxShadowPreset || null) === preset.value}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </section>
  );
};

interface BoxShadowTabControlProps {
  controlId?: string;
  activeTab: "normal" | "hover";
  onTabChange: (tab: "normal" | "hover") => void;
}

const BoxShadowTabControl: React.FC<BoxShadowTabControlProps> = ({ controlId = "box-shadow-tabs", activeTab, onTabChange }) => {
  const baseId = `box-shadow-tabs-${controlId}`;

  return (
    <nav id={baseId} data-component-id={baseId} className="flex border-b border-gray-200">
      {["normal", "hover"].map((tab) => (
        <button key={tab} type="button" onClick={() => onTabChange(tab as "normal" | "hover")} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`} aria-pressed={activeTab === tab}>
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  );
};

const BoxShadowValuesControl = <TProps extends BoxShadowFeatureProps>({ props, actions, controlId = "box-shadow-values" }: BoxShadowControlsProps<TProps>) => {
  const baseId = `box-shadow-values-${controlId}`;
  const isEnabled = props.enableBoxShadow ?? false;

  const handleNumberChange = (key: "boxShadowHorizontal" | "boxShadowVertical" | "boxShadowBlur" | "boxShadowSpread", value: string) => {
    const parsed = Number(value);
    actions.setProp((draft) => {
      const safeValue = Number.isNaN(parsed) ? 0 : parsed;
      draft[key] = safeValue;
      switch (key) {
        case "boxShadowHorizontal":
          draft.boxShadowHorizontalResponsive = undefined;
          break;
        case "boxShadowVertical":
          draft.boxShadowVerticalResponsive = undefined;
          break;
        case "boxShadowBlur":
          draft.boxShadowBlurResponsive = undefined;
          break;
        case "boxShadowSpread":
          draft.boxShadowSpreadResponsive = undefined;
          break;
      }
    });
  };

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Normal State</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id={`${baseId}-toggle`}
            type="checkbox"
            checked={isEnabled}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.enableBoxShadow = event.target.checked;
              })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {isEnabled && (
        <>
          <div className={INLINE_ROW_CLASS}>
            <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-color`}>
              Color
            </label>
            <input
              id={`${baseId}-color`}
              type="text"
              value={props.boxShadowColor || "rgba(0, 0, 0, 0.1)"}
              onChange={(event) =>
                actions.setProp((draft) => {
                  draft.boxShadowColor = event.target.value;
                })
              }
              className={INLINE_FIELD_CLASS}
              placeholder="rgba(0, 0, 0, 0.1)"
            />
          </div>
          <div className="space-y-3">
            <NumberField id={`${baseId}-horizontal`} label="Horizontal" min={-100} max={100} value={props.boxShadowHorizontal ?? 0} onChange={(event) => handleNumberChange("boxShadowHorizontal", event.target.value)} />
            <NumberField id={`${baseId}-vertical`} label="Vertical" min={-100} max={100} value={props.boxShadowVertical ?? 0} onChange={(event) => handleNumberChange("boxShadowVertical", event.target.value)} />
            <NumberField id={`${baseId}-blur`} label="Blur" min={0} max={100} value={props.boxShadowBlur ?? 0} onChange={(event) => handleNumberChange("boxShadowBlur", event.target.value)} />
            <NumberField id={`${baseId}-spread`} label="Spread" min={-100} max={100} value={props.boxShadowSpread ?? 0} onChange={(event) => handleNumberChange("boxShadowSpread", event.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-position`}>
              Position
            </label>
            <div id={`${baseId}-position`} className="grid grid-cols-2 gap-1">
              {["outset", "inset"].map((position) => (
                <button
                  key={position}
                  type="button"
                  data-component-id={`${baseId}-position-${position}`}
                  onClick={() =>
                    actions.setProp((draft) => {
                      draft.boxShadowPosition = position;
                    })
                  }
                  className={`px-3 py-2 text-xs border rounded capitalize ${(props.boxShadowPosition || "outset") === position ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  aria-pressed={(props.boxShadowPosition || "outset") === position}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

const BoxShadowHoverControls = <TProps extends BoxShadowFeatureProps>({ props, actions, controlId = "box-shadow-hover-values" }: BoxShadowControlsProps<TProps>) => {
  const baseId = `box-shadow-hover-${controlId}`;
  const isEnabled = props.enableBoxShadowHover ?? false;

  const handleNumberChange = (key: "boxShadowHorizontalHover" | "boxShadowVerticalHover" | "boxShadowBlurHover" | "boxShadowSpreadHover", value: string) => {
    const parsed = Number(value);
    actions.setProp((draft) => {
      const safeValue = Number.isNaN(parsed) ? 0 : parsed;
      draft[key] = safeValue;
      switch (key) {
        case "boxShadowHorizontalHover":
          draft.boxShadowHorizontalHoverResponsive = undefined;
          break;
        case "boxShadowVerticalHover":
          draft.boxShadowVerticalHoverResponsive = undefined;
          break;
        case "boxShadowBlurHover":
          draft.boxShadowBlurHoverResponsive = undefined;
          break;
        case "boxShadowSpreadHover":
          draft.boxShadowSpreadHoverResponsive = undefined;
          break;
      }
    });
  };

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Hover State</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id={`${baseId}-toggle`}
            type="checkbox"
            checked={isEnabled}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.enableBoxShadowHover = event.target.checked;
              })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {isEnabled && (
        <>
          <div className={INLINE_ROW_CLASS}>
            <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-color`}>
              Hover Color
            </label>
            <input
              id={`${baseId}-color`}
              type="text"
              value={props.boxShadowColorHover || "rgba(0, 0, 0, 0.15)"}
              onChange={(event) =>
                actions.setProp((draft) => {
                  draft.boxShadowColorHover = event.target.value;
                })
              }
              className={INLINE_FIELD_CLASS}
              placeholder="rgba(0, 0, 0, 0.15)"
            />
          </div>
          <div className="space-y-3">
            <NumberField id={`${baseId}-horizontal`} label="Horizontal" min={-100} max={100} value={props.boxShadowHorizontalHover ?? 0} onChange={(event) => handleNumberChange("boxShadowHorizontalHover", event.target.value)} />
            <NumberField id={`${baseId}-vertical`} label="Vertical" min={-100} max={100} value={props.boxShadowVerticalHover ?? 0} onChange={(event) => handleNumberChange("boxShadowVerticalHover", event.target.value)} />
            <NumberField id={`${baseId}-blur`} label="Blur" min={0} max={100} value={props.boxShadowBlurHover ?? 0} onChange={(event) => handleNumberChange("boxShadowBlurHover", event.target.value)} />
            <NumberField id={`${baseId}-spread`} label="Spread" min={-100} max={100} value={props.boxShadowSpreadHover ?? 0} onChange={(event) => handleNumberChange("boxShadowSpreadHover", event.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-position`}>
              Hover Position
            </label>
            <div id={`${baseId}-position`} className="grid grid-cols-2 gap-1">
              {["outset", "inset"].map((position) => (
                <button
                  key={position}
                  type="button"
                  data-component-id={`${baseId}-position-${position}`}
                  onClick={() =>
                    actions.setProp((draft) => {
                      draft.boxShadowPositionHover = position;
                    })
                  }
                  className={`px-3 py-2 text-xs border rounded capitalize ${(props.boxShadowPositionHover || "outset") === position ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  aria-pressed={(props.boxShadowPositionHover || "outset") === position}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export const BoxShadowControls = <TProps extends BoxShadowFeatureProps>({ props, actions, controlId = "box-shadow" }: BoxShadowControlsProps<TProps>) => {
  const [activeTab, setActiveTab] = React.useState<"normal" | "hover">("normal");
  const baseId = `box-shadow-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <BoxShadowPresetControl props={props} actions={actions} controlId={`${controlId}-preset`} />
      <BoxShadowTabControl controlId={`${controlId}-tabs`} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "normal" ? (
        <BoxShadowValuesControl props={props} actions={actions} controlId={`${controlId}-normal`} />
      ) : (
        <BoxShadowHoverControls props={props} actions={actions} controlId={`${controlId}-hover`} />
      )}
    </div>
  );
};

