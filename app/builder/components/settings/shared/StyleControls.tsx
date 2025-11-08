"use client";

import React from "react";
import { Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import type { ContainerProps } from "../../ui/Container";
import type { ContainerControlActions } from "./types";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "./styles";

interface StyleControlProps {
  props: ContainerProps;
  actions: ContainerControlActions;
  controlId?: string;
}

type ResponsiveRecord = Record<string, unknown>;

interface ColorInputProps {
  label: string;
  value: unknown;
  onChange: (value: unknown) => void;
  placeholder?: string;
  responsive?: boolean;
}

interface ResponsiveNumberInputProps {
  controlId?: string;
  label: string;
  value: ResponsiveRecord | undefined;
  onChange: (value: ResponsiveRecord, isThrottled?: boolean) => void;
  min?: number;
  max?: number;
  unit?: string;
  unitOptions?: string[];
  defaultValue?: number;
}

interface ResponsiveSpacingControlProps {
  controlId?: string;
  label: string;
  value: ResponsiveRecord | undefined;
  onChange: (value: ResponsiveRecord) => void;
  unitOptions?: string[];
  defaultValue?: number;
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

// Reusable Color Input Component
export const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange, placeholder = "#000000", responsive = false }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  if (responsive) {
    const responsiveValue = getResponsiveValue((value as ResponsiveRecord) || {}, null);
    const hasCustomValue = responsiveValue !== null;

    const handleResponsiveChange = (newValue: string | null) => {
      const updatedValues = setResponsiveValue((value as ResponsiveRecord) || {}, currentBreakpoint, newValue);
      onChange(updatedValues);
    };

    const handleReset = () => {
      const updatedValues = setResponsiveValue((value as ResponsiveRecord) || {}, currentBreakpoint, null);
      onChange(updatedValues);
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            {label}
            <span className="ml-2 text-blue-600">
              {currentBreakpoint === "desktop" && <Monitor size={12} />}
              {currentBreakpoint === "tablet" && <Tablet size={12} />}
              {currentBreakpoint === "mobile" && <Smartphone size={12} />}
            </span>
          </label>
          {hasCustomValue && (
            <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors" title="Reset to default">
              <RotateCcw size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <input type="color" value={responsiveValue || placeholder} onChange={(e) => handleResponsiveChange(e.target.value)} className="w-10 h-10 shrink-0 border border-gray-300 rounded-full cursor-pointer appearance-none" />
          <input type="text" value={responsiveValue || ""} onChange={(e) => handleResponsiveChange(e.target.value || null)} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder={placeholder} />
        </div>
      </div>
    );
  }

  const stringValue = (value as string | null) ?? "";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2">
        <input type="color" value={stringValue || placeholder} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 shrink-0 border border-gray-300 rounded-full cursor-pointer appearance-none" />
        <input type="text" value={stringValue} onChange={(e) => onChange(e.target.value || null)} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder={placeholder} />
      </div>
    </div>
  );
};

export const BackgroundTypeControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "background-type" }: StyleControlProps) => {
  const baseId = `background-type-${controlId}`;
  const options = ["color", "gradient", "image"];

  return (
    <section id={baseId} data-component-id={baseId}>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-buttons`}>
        Background Type
      </label>
      <div id={`${baseId}-buttons`} className="grid grid-cols-3 gap-1">
        {options.map((type) => {
          const isActive = props.backgroundType === type;
          return (
            <button
              key={type}
              type="button"
              data-component-id={`${baseId}-${type}`}
              onClick={() =>
                actions.setProp((draft: typeof props) => {
                  draft.backgroundType = isActive ? null : type;
                })
              }
              className={`px-3 py-2 text-xs border rounded capitalize transition-colors ${isActive ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
              aria-pressed={isActive}
            >
              {type}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export const BackgroundColorControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "background-color" }: StyleControlProps) => {
  if (props.backgroundType !== "color") return null;

  const baseId = `background-color-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <ColorInput
        label="Background Color"
        value={props.backgroundColorResponsive}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.backgroundColorResponsive = value as typeof draft.backgroundColorResponsive;
          })
        }
        placeholder="#ffffff"
        responsive={true}
      />
      <ColorInput
        label="Hover Color"
        value={props.backgroundColorHoverResponsive}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.backgroundColorHoverResponsive = value as typeof draft.backgroundColorHoverResponsive;
          })
        }
        placeholder="#f0f0f0"
        responsive={true}
      />
    </section>
  );
};

export const BackgroundGradientControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "background-gradient" }: StyleControlProps) => {
  if (props.backgroundType !== "gradient") return null;

  const baseId = `background-gradient-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-gradient`}>
          Gradient
        </label>
        <input id={`${baseId}-gradient`} type="text" value={props.backgroundGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.backgroundGradient = e.target.value))} className={INLINE_FIELD_CLASS} placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
      </div>
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-hover-gradient`}>
          Hover Gradient
        </label>
        <input id={`${baseId}-hover-gradient`} type="text" value={props.backgroundGradientHover || "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.backgroundGradientHover = e.target.value))} className={INLINE_FIELD_CLASS} placeholder="linear-gradient(135deg, #764ba2 0%, #667eea 100%)" />
      </div>
    </section>
  );
};

export const BackgroundImageControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "background-image" }: StyleControlProps) => {
  if (props.backgroundType !== "image") return null;

  const baseId = `background-image-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-input`}>
          Image URL
        </label>
        <input id={`${baseId}-input`} type="text" value={props.backgroundImage || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.backgroundImage = e.target.value))} className={INLINE_FIELD_CLASS} placeholder="https://example.com/image.jpg" />
      </div>
    </section>
  );
};

// Background Controls Component
export const BackgroundControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "background" }: StyleControlProps) => {
  const baseId = `background-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <BackgroundTypeControl props={props} actions={actions} controlId={`${controlId}-type`} />
      <BackgroundColorControls props={props} actions={actions} controlId={`${controlId}-color`} />
      <BackgroundGradientControls props={props} actions={actions} controlId={`${controlId}-gradient`} />
      <BackgroundImageControl props={props} actions={actions} controlId={`${controlId}-image`} />
    </div>
  );
};

export const BorderStyleControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "border-style" }: StyleControlProps) => {
  const baseId = `border-style-${controlId}`;
  const options = ["none", "solid", "dotted", "dashed", "double", "groove", "inset", "outset", "ridge"];

  return (
    <section id={baseId} data-component-id={baseId}>
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-select`}>
          Border Style
        </label>
        <select
          id={`${baseId}-select`}
          value={props.borderStyle || "none"}
          onChange={(e) =>
            actions.setProp((draft: typeof props) => {
              draft.borderStyle = e.target.value;
            })
          }
          className={INLINE_FIELD_CLASS}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export const BorderWidthControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "border-width" }: StyleControlProps) => {
  if (!props.borderStyle || props.borderStyle === "none") return null;

  return (
    <ResponsiveSpacingControl
      controlId={controlId}
      label="Border Width"
      value={props.borderWidthResponsive as ResponsiveRecord | undefined}
      onChange={(value) =>
        actions.setProp((draft: typeof props) => {
          draft.borderWidthResponsive = value as typeof draft.borderWidthResponsive;
        })
      }
      unitOptions={["px"]}
      defaultValue={1}
    />
  );
};

export const BorderColorControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "border-color" }: StyleControlProps) => {
  if (!props.borderStyle || props.borderStyle === "none") return null;

  const baseId = `border-color-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <ColorInput
        label="Border Color"
        value={props.borderColorResponsive}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.borderColorResponsive = value as typeof draft.borderColorResponsive;
          })
        }
        placeholder="#000000"
        responsive={true}
      />
      <ColorInput
        label="Hover Border Color"
        value={props.borderColorHoverResponsive}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.borderColorHoverResponsive = value as typeof draft.borderColorHoverResponsive;
          })
        }
        placeholder="#333333"
        responsive={true}
      />
    </section>
  );
};

export const BorderRadiusControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "border-radius" }: StyleControlProps) => {
  return (
    <ResponsiveSpacingControl
      controlId={controlId}
      label="Border Radius"
      value={props.borderRadiusResponsive as ResponsiveRecord | undefined}
      onChange={(value) =>
        actions.setProp((draft: typeof props) => {
          draft.borderRadiusResponsive = value as typeof draft.borderRadiusResponsive;
        })
      }
      unitOptions={["px", "%"]}
      defaultValue={0}
    />
  );
};

// Border Controls Component
export const BorderControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "border" }: StyleControlProps) => {
  const baseId = `border-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <BorderStyleControl props={props} actions={actions} controlId={`${controlId}-style`} />
      <BorderWidthControl props={props} actions={actions} controlId={`${controlId}-width`} />
      <BorderColorControls props={props} actions={actions} controlId={`${controlId}-color`} />
      <BorderRadiusControl props={props} actions={actions} controlId={`${controlId}-radius`} />
    </div>
  );
};

// Box Shadow Controls Component
interface BoxShadowPresetControlProps extends StyleControlProps {
  controlId?: string;
}

export const BoxShadowPresetControl: React.FC<BoxShadowPresetControlProps> = ({ props, actions, controlId = "box-shadow-preset" }: BoxShadowPresetControlProps) => {
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
          <button key={preset.value ?? "none"} type="button" data-component-id={`${baseId}-${preset.value ?? "none"}`} onClick={() => applyPreset(preset.value)} className={`p-3 text-xs border rounded text-center transition-colors ${(props.boxShadowPreset || null) === preset.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`} style={{ boxShadow: preset.shadow }} aria-pressed={(props.boxShadowPreset || null) === preset.value}>
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

export const BoxShadowTabControl: React.FC<BoxShadowTabControlProps> = ({ controlId = "box-shadow-tabs", activeTab, onTabChange }: BoxShadowTabControlProps) => {
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

export const BoxShadowValuesControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "box-shadow-values" }: StyleControlProps) => {
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

export const BoxShadowHoverControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "box-shadow-hover-values" }: StyleControlProps) => {
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

export const BoxShadowControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "box-shadow" }: StyleControlProps) => {
  const [activeTab, setActiveTab] = React.useState<"normal" | "hover">("normal");
  const baseId = `box-shadow-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <BoxShadowPresetControl props={props} actions={actions} controlId={`${controlId}-preset`} />
      <BoxShadowTabControl controlId={`${controlId}-tabs`} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "normal" ? <BoxShadowValuesControl props={props} actions={actions} controlId={`${controlId}-normal`} /> : <BoxShadowHoverControls props={props} actions={actions} controlId={`${controlId}-hover`} />}
    </div>
  );
};

// Responsive Number Input Component
export const ResponsiveNumberInput: React.FC<ResponsiveNumberInputProps> = ({ controlId = "responsive-number", label, value, onChange, min = 0, max = 1000, unit = "px", unitOptions = ["px", "%"], defaultValue = 0 }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  const responsiveValue = getResponsiveValue(value || {}, defaultValue);
  const responsiveUnit = getResponsiveValue((value as ResponsiveRecord)?.unit || {}, unit);

  const handleValueChange = (newValue: number) => {
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, newValue);
    onChange(updatedValues);
  };

  const handleThrottledChange = (newValue: number) => {
    // Use throttled history for rapid changes like slider movements
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, newValue);
    onChange(updatedValues, true); // Pass throttle flag
  };

  const handleUnitChange = (newUnit: string) => {
    const updatedUnits = setResponsiveValue(value?.unit || {}, currentBreakpoint, newUnit);
    onChange({ ...value, unit: updatedUnits });
  };

  const hasCustomValue = responsiveValue !== defaultValue;

  const handleReset = () => {
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, defaultValue);
    onChange(updatedValues);
  };

  const showUnitSelector = unitOptions.length > 1;

  const baseId = `responsive-number-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId}>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700" htmlFor={`${baseId}-number`}>
          {label}
          <span className="ml-2 text-blue-600">
            {currentBreakpoint === "desktop" && <Monitor size={12} />}
            {currentBreakpoint === "tablet" && <Tablet size={12} />}
            {currentBreakpoint === "mobile" && <Smartphone size={12} />}
          </span>
        </label>
        {hasCustomValue && (
          <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors" title="Reset to default">
            <RotateCcw size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input id={`${baseId}-range`} type="range" min={min} max={max} value={responsiveValue} onChange={(e) => handleThrottledChange(parseInt(e.target.value))} className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        <input id={`${baseId}-number`} type="number" value={responsiveValue} onChange={(e) => handleValueChange(parseInt(e.target.value))} className={`w-16 px-2 py-1 text-xs border border-gray-300 text-gray-900 bg-white ${showUnitSelector ? "rounded-l" : "rounded"}`} />
        {showUnitSelector && (
          <select id={`${baseId}-unit`} value={responsiveUnit} onChange={(e) => handleUnitChange(e.target.value)} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
            {unitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
        {!showUnitSelector && <span className="px-2 py-1 text-xs text-gray-500">{unit}</span>}
      </div>
    </div>
  );
};

// Responsive Spacing Control Component
export const ResponsiveSpacingControl: React.FC<ResponsiveSpacingControlProps> = ({ controlId = "responsive-spacing", label, value, onChange, unitOptions = ["px", "%"], defaultValue }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  const getValue = (side: string) => {
    const sideValues = value?.[side] || {};
    const fallback = defaultValue !== undefined ? defaultValue : null;
    return getResponsiveValue(sideValues, fallback);
  };

  const getUnit = () => {
    const unitValues = value?.unit || {};
    return getResponsiveValue(unitValues, "px");
  };

  const setValue = (side: string, inputValue: string) => {
    const trimmed = inputValue.trim();
    const currentSideValues = (value?.[side] as Record<string, number | null>) || {};

    if (trimmed === "") {
      const nextSideValues = { ...currentSideValues };
      delete nextSideValues[currentBreakpoint];
      const nextState: ResponsiveRecord = { ...(value || {}) };
      if (Object.keys(nextSideValues).length === 0) {
        delete nextState[side];
      } else {
        nextState[side] = nextSideValues;
      }

      if (defaultValue === undefined) {
        const hasAnySide = ["top", "right", "bottom", "left"].some((key) => {
          const sideRecord = nextState[key] as Record<string, unknown> | undefined;
          return sideRecord && Object.keys(sideRecord).length > 0;
        });
        if (!hasAnySide) {
          delete nextState.unit;
        }
      }

      onChange(nextState);
      return;
    }

    if (!/^-?\d+$/.test(trimmed)) {
      return;
    }

    const parsed = parseInt(trimmed, 10);
    const updatedSideValues = setResponsiveValue(currentSideValues, currentBreakpoint, parsed);
    onChange({ ...value, [side]: updatedSideValues });
  };

  const setUnit = (newUnit: string) => {
    const currentUnitValues = value?.unit || {};
    const updatedUnitValues = setResponsiveValue(currentUnitValues, currentBreakpoint, newUnit);
    onChange({ ...value, unit: updatedUnitValues });
  };

  const hasCustomValues = ["top", "right", "bottom", "left"].some((side) => {
    const resolved = getValue(side);
    if (defaultValue !== undefined) {
      return resolved !== defaultValue;
    }
    return resolved !== null && resolved !== undefined;
  });

  const handleReset = () => {
    const resetValues: Record<string, unknown> = { ...(value || {}) };
    ["top", "right", "bottom", "left"].forEach((side) => {
      const currentSideValues = (value?.[side] as Record<string, number | null>) || {};
      if (defaultValue === undefined) {
        const nextSideValues = { ...currentSideValues };
        delete nextSideValues[currentBreakpoint];
        if (Object.keys(nextSideValues).length === 0) {
          delete resetValues[side];
        } else {
          resetValues[side] = nextSideValues;
        }
      } else {
        resetValues[side] = setResponsiveValue(currentSideValues, currentBreakpoint, defaultValue);
      }
    });

    if (defaultValue === undefined && resetValues.unit) {
      const nextUnits = { ...(resetValues.unit as Record<string, string>) };
      delete nextUnits[currentBreakpoint];
      if (Object.keys(nextUnits).length === 0) {
        delete resetValues.unit;
      } else {
        resetValues.unit = nextUnits;
      }
    }

    onChange(resetValues);
  };

  const baseId = `responsive-spacing-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId}>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700" htmlFor={`${baseId}-unit`}>
          {label}
          <span className="ml-2 text-blue-600">
            {currentBreakpoint === "desktop" && <Monitor size={12} />}
            {currentBreakpoint === "tablet" && <Tablet size={12} />}
            {currentBreakpoint === "mobile" && <Smartphone size={12} />}
          </span>
        </label>
        <div className="flex items-center gap-2">
          {defaultValue !== undefined && hasCustomValues && (
            <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors" title="Reset to default">
              <RotateCcw size={14} />
            </button>
          )}
          <select id={`${baseId}-unit`} value={getUnit()} onChange={(e) => setUnit(e.target.value)} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white">
            {unitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {["top", "right", "bottom", "left"].map((side) => (
          <div key={side}>
            <label className="block text-xs text-gray-500 mb-1 capitalize" htmlFor={`${baseId}-${side}`}>
              {side}
            </label>
            <input id={`${baseId}-${side}`} type="text" inputMode="numeric" pattern="-?\\d*" value={getValue(side) !== null && getValue(side) !== undefined ? String(getValue(side)) : ""} onChange={(e) => setValue(side, e.target.value)} className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const GapControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "spacing-gaps" }: StyleControlProps) => {
  if (props.layout !== "flex") return null;

  const baseId = `gap-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <ResponsiveNumberInput
        controlId={`${baseId}-row`}
        label="Row Gap"
        value={props.rowGapResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.rowGapResponsive = value as typeof draft.rowGapResponsive;
          })
        }
        max={100}
        unitOptions={["px", "%"]}
        defaultValue={20}
      />

      <ResponsiveNumberInput
        controlId={`${baseId}-column`}
        label="Column Gap"
        value={props.columnGapResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.columnGapResponsive = value as typeof draft.columnGapResponsive;
          })
        }
        max={100}
        unitOptions={["px", "%"]}
        defaultValue={20}
      />
    </section>
  );
};

export const PaddingControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "spacing-padding" }: StyleControlProps) => {
  const baseId = `padding-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <ResponsiveSpacingControl
        controlId={`${baseId}-responsive`}
        label="Padding"
        value={props.paddingResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.paddingResponsive = value as typeof draft.paddingResponsive;
          })
        }
        defaultValue={10}
      />
    </section>
  );
};

export const MarginControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "spacing-margin" }: StyleControlProps) => {
  const baseId = `margin-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <ResponsiveSpacingControl
        controlId={`${baseId}-responsive`}
        label="Margin"
        value={props.marginResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.marginResponsive = value as typeof draft.marginResponsive;
          })
        }
        unitOptions={["px", "%", "auto"]}
      />
    </section>
  );
};

// Spacing Controls Component
export const SpacingControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "spacing" }: StyleControlProps) => {
  const baseId = `spacing-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <GapControls props={props} actions={actions} controlId={`${controlId}-gaps`} />
      <PaddingControl props={props} actions={actions} controlId={`${controlId}-padding`} />
      <MarginControl props={props} actions={actions} controlId={`${controlId}-margin`} />
    </div>
  );
};

export const TextColorControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "color-text" }: StyleControlProps) => {
  const baseId = `text-color-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <ColorInput
        label="Text Color"
        value={props.textColorResponsive}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.textColorResponsive = value as typeof draft.textColorResponsive;
          })
        }
        placeholder="#000000 or inherit"
        responsive={true}
      />
    </section>
  );
};

export const LinkColorControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "color-link" }: StyleControlProps) => {
  const baseId = `link-color-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <ColorInput
        label="Link Color"
        value={props.linkColorResponsive}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.linkColorResponsive = value as typeof draft.linkColorResponsive;
          })
        }
        placeholder="#0066cc or inherit"
        responsive={true}
      />
      <ColorInput
        label="Link Hover Color"
        value={props.linkColorHoverResponsive}
        onChange={(value) =>
          actions.setProp((draft: typeof props) => {
            draft.linkColorHoverResponsive = value as typeof draft.linkColorHoverResponsive;
          })
        }
        placeholder="#004499 or inherit"
        responsive={true}
      />
    </section>
  );
};

// Color Controls Component
export const ColorControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "color" }: StyleControlProps) => {
  const baseId = `color-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <TextColorControl props={props} actions={actions} controlId={`${controlId}-text`} />
      <LinkColorControl props={props} actions={actions} controlId={`${controlId}-link`} />
    </div>
  );
};
