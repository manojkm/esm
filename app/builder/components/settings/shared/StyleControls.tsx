"use client";

import React from "react";
import { Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";

interface StyleControlProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
  controlId?: string;
}

type ResponsiveRecord = Record<string, unknown>;

interface ColorInputProps {
  label: string;
  value: string | null | ResponsiveRecord;
  onChange: (value: string | null | ResponsiveRecord) => void;
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
      <ColorInput label="Background Color" value={props.backgroundColorResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.backgroundColorResponsive = value))} placeholder="#ffffff" responsive={true} />
      <ColorInput label="Hover Color" value={props.backgroundColorHoverResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.backgroundColorHoverResponsive = value))} placeholder="#f0f0f0" responsive={true} />
    </section>
  );
};

export const BackgroundGradientControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "background-gradient" }: StyleControlProps) => {
  if (props.backgroundType !== "gradient") return null;

  const baseId = `background-gradient-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-gradient`}>
          Gradient
        </label>
        <input id={`${baseId}-gradient`} type="text" value={props.backgroundGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.backgroundGradient = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-hover-gradient`}>
          Hover Gradient
        </label>
        <input id={`${baseId}-hover-gradient`} type="text" value={props.backgroundGradientHover || "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.backgroundGradientHover = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="linear-gradient(135deg, #764ba2 0%, #667eea 100%)" />
      </div>
    </section>
  );
};

export const BackgroundImageControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "background-image" }: StyleControlProps) => {
  if (props.backgroundType !== "image") return null;

  const baseId = `background-image-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-input`}>
        Image URL
      </label>
      <input id={`${baseId}-input`} type="text" value={props.backgroundImage || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.backgroundImage = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="https://example.com/image.jpg" />
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
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-select`}>
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </section>
  );
};

export const BorderWidthControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "border-width" }: StyleControlProps) => {
  if (!props.borderStyle || props.borderStyle === "none") return null;

  return <ResponsiveSpacingControl controlId={controlId} label="Border Width" value={props.borderWidthResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.borderWidthResponsive = value))} unitOptions={["px"]} defaultValue={1} />;
};

export const BorderColorControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "border-color" }: StyleControlProps) => {
  if (!props.borderStyle || props.borderStyle === "none") return null;

  const baseId = `border-color-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <ColorInput label="Border Color" value={props.borderColorResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.borderColorResponsive = value))} placeholder="#000000" responsive={true} />
      <ColorInput label="Hover Border Color" value={props.borderColorHoverResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.borderColorHoverResponsive = value))} placeholder="#333333" responsive={true} />
    </section>
  );
};

export const BorderRadiusControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "border-radius" }: StyleControlProps) => {
  return <ResponsiveSpacingControl controlId={controlId} label="Border Radius" value={props.borderRadiusResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.borderRadiusResponsive = value))} unitOptions={["px", "%"]} defaultValue={0} />;
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
    actions.setProp((draft: typeof props) => {
      draft.boxShadowPreset = presetValue;
      const currentBreakpoint = "desktop";

      const resetValues = () => {
        draft.boxShadowHorizontalResponsive = { [currentBreakpoint]: 0 };
        draft.boxShadowVerticalResponsive = { [currentBreakpoint]: 0 };
        draft.boxShadowBlurResponsive = { [currentBreakpoint]: 0 };
        draft.boxShadowSpreadResponsive = { [currentBreakpoint]: 0 };
        draft.boxShadowHorizontalHoverResponsive = { [currentBreakpoint]: 0 };
        draft.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 0 };
        draft.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 0 };
        draft.boxShadowSpreadHoverResponsive = { [currentBreakpoint]: 0 };
      };

      resetValues();

      switch (presetValue) {
        case null:
          draft.boxShadowColor = "rgba(0, 0, 0, 0.1)";
          draft.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
          break;
        case "subtle":
          draft.boxShadowVerticalResponsive = { [currentBreakpoint]: 1 };
          draft.boxShadowBlurResponsive = { [currentBreakpoint]: 3 };
          draft.boxShadowColor = "rgba(0, 0, 0, 0.1)";
          draft.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 2 };
          draft.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 6 };
          draft.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
          break;
        case "small":
          draft.boxShadowVerticalResponsive = { [currentBreakpoint]: 1 };
          draft.boxShadowBlurResponsive = { [currentBreakpoint]: 3 };
          draft.boxShadowColor = "rgba(0, 0, 0, 0.1)";
          draft.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 4 };
          draft.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 8 };
          draft.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
          break;
        case "medium":
          draft.boxShadowVerticalResponsive = { [currentBreakpoint]: 4 };
          draft.boxShadowBlurResponsive = { [currentBreakpoint]: 6 };
          draft.boxShadowColor = "rgba(0, 0, 0, 0.1)";
          draft.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 8 };
          draft.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 15 };
          draft.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
          break;
        case "large":
          draft.boxShadowVerticalResponsive = { [currentBreakpoint]: 10 };
          draft.boxShadowBlurResponsive = { [currentBreakpoint]: 15 };
          draft.boxShadowColor = "rgba(0, 0, 0, 0.1)";
          draft.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 15 };
          draft.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 25 };
          draft.boxShadowColorHover = "rgba(0, 0, 0, 0.2)";
          break;
        case "xl":
          draft.boxShadowVerticalResponsive = { [currentBreakpoint]: 20 };
          draft.boxShadowBlurResponsive = { [currentBreakpoint]: 25 };
          draft.boxShadowColor = "rgba(0, 0, 0, 0.1)";
          draft.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 25 };
          draft.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 50 };
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

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-color`}>
          Color
        </label>
        <input id={`${baseId}-color`} type="text" value={props.boxShadowColor || "rgba(0, 0, 0, 0.1)"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.boxShadowColor = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="rgba(0, 0, 0, 0.1)" />
      </div>
      <div className="space-y-3">
        <ResponsiveNumberInput controlId={`${baseId}-horizontal`} label="Horizontal" value={props.boxShadowHorizontalResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.boxShadowHorizontalResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
        <ResponsiveNumberInput controlId={`${baseId}-vertical`} label="Vertical" value={props.boxShadowVerticalResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.boxShadowVerticalResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
        <ResponsiveNumberInput controlId={`${baseId}-blur`} label="Blur" value={props.boxShadowBlurResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.boxShadowBlurResponsive = value))} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
        <ResponsiveNumberInput controlId={`${baseId}-spread`} label="Spread" value={props.boxShadowSpreadResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.boxShadowSpreadResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
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
                actions.setProp((draft: typeof props) => {
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
    </section>
  );
};

export const BoxShadowHoverControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "box-shadow-hover-values" }: StyleControlProps) => {
  const baseId = `box-shadow-hover-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-color`}>
          Hover Color
        </label>
        <input id={`${baseId}-color`} type="text" value={props.boxShadowColorHover || "rgba(0, 0, 0, 0.15)"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.boxShadowColorHover = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="rgba(0, 0, 0, 0.15)" />
      </div>
      <div className="space-y-3">
        <ResponsiveNumberInput controlId={`${baseId}-horizontal`} label="Horizontal" value={props.boxShadowHorizontalHoverResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.boxShadowHorizontalHoverResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
        <ResponsiveNumberInput controlId={`${baseId}-vertical`} label="Vertical" value={props.boxShadowVerticalHoverResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.boxShadowVerticalHoverResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
        <ResponsiveNumberInput controlId={`${baseId}-blur`} label="Blur" value={props.boxShadowBlurHoverResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.boxShadowBlurHoverResponsive = value))} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
        <ResponsiveNumberInput controlId={`${baseId}-spread`} label="Spread" value={props.boxShadowSpreadHoverResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.boxShadowSpreadHoverResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
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
                actions.setProp((draft: typeof props) => {
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
export const ResponsiveSpacingControl: React.FC<ResponsiveSpacingControlProps> = ({ controlId = "responsive-spacing", label, value, onChange, unitOptions = ["px", "%"], defaultValue = 0 }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  const getValue = (side: string) => {
    const sideValues = value?.[side] || {};
    return getResponsiveValue(sideValues, defaultValue);
  };

  const getUnit = () => {
    const unitValues = value?.unit || {};
    return getResponsiveValue(unitValues, "px");
  };

  const setValue = (side: string, newValue: number) => {
    const currentSideValues = value?.[side] || {};
    const updatedSideValues = setResponsiveValue(currentSideValues, currentBreakpoint, newValue);
    onChange({ ...value, [side]: updatedSideValues });
  };

  const setUnit = (newUnit: string) => {
    const currentUnitValues = value?.unit || {};
    const updatedUnitValues = setResponsiveValue(currentUnitValues, currentBreakpoint, newUnit);
    onChange({ ...value, unit: updatedUnitValues });
  };

  const hasCustomValues = ["top", "right", "bottom", "left"].some((side) => getValue(side) !== defaultValue);

  const handleReset = () => {
    const resetValues: Record<string, unknown> = {};
    ["top", "right", "bottom", "left"].forEach((side) => {
      const currentSideValues = value?.[side] || {};
      resetValues[side] = setResponsiveValue(currentSideValues, currentBreakpoint, defaultValue);
    });
    onChange({ ...value, ...resetValues });
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
          {hasCustomValues && (
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
            <input id={`${baseId}-${side}`} type="number" value={getValue(side)} onChange={(e) => setValue(side, parseInt(e.target.value))} className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
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
      <ResponsiveNumberInput controlId={`${baseId}-row`} label="Row Gap" value={props.rowGapResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.rowGapResponsive = value))} max={100} unitOptions={["px", "%"]} defaultValue={20} />

      <ResponsiveNumberInput controlId={`${baseId}-column`} label="Column Gap" value={props.columnGapResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.columnGapResponsive = value))} max={100} unitOptions={["px", "%"]} defaultValue={20} />
    </section>
  );
};

export const PaddingControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "spacing-padding" }: StyleControlProps) => {
  const baseId = `padding-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <ResponsiveSpacingControl controlId={`${baseId}-responsive`} label="Padding" value={props.paddingResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.paddingResponsive = value))} defaultValue={10} />
    </section>
  );
};

export const MarginControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "spacing-margin" }: StyleControlProps) => {
  const baseId = `margin-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId}>
      <ResponsiveSpacingControl controlId={`${baseId}-responsive`} label="Margin" value={props.marginResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.marginResponsive = value))} unitOptions={["px", "%", "auto"]} />
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
      <ColorInput label="Text Color" value={props.textColorResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.textColorResponsive = value))} placeholder="#000000 or inherit" responsive={true} />
    </section>
  );
};

export const LinkColorControl: React.FC<StyleControlProps> = ({ props, actions, controlId = "color-link" }: StyleControlProps) => {
  const baseId = `link-color-control-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <ColorInput label="Link Color" value={props.linkColorResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.linkColorResponsive = value))} placeholder="#0066cc or inherit" responsive={true} />
      <ColorInput label="Link Hover Color" value={props.linkColorHoverResponsive} onChange={(value) => actions.setProp((draft: typeof props) => (draft.linkColorHoverResponsive = value))} placeholder="#004499 or inherit" responsive={true} />
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

// Reusable CSS Controls Component
export const CSSControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "css" }: StyleControlProps) => {
  const baseId = `css-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-classes`}>
          CSS Classes
        </label>
        <input id={`${baseId}-classes`} type="text" value={props.className || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.className = e.target.value))} placeholder="custom-class another-class" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
        <p className="text-xs text-gray-500 mt-1">Add custom CSS classes separated by spaces</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-id`}>
          CSS ID
        </label>
        <input id={`${baseId}-id`} type="text" value={props.cssId || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.cssId = e.target.value))} placeholder="unique-id" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
        <p className="text-xs text-gray-500 mt-1">Unique identifier for this element</p>
      </div>
    </div>
  );
};

// Reusable Attributes Controls Component
export const AttributesControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "attributes" }: StyleControlProps) => {
  const baseId = `attribute-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-data`}>
          Data Attributes
        </label>
        <textarea id={`${baseId}-data`} value={props.dataAttributes || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.dataAttributes = e.target.value))} placeholder={"data-scroll=&quot;true&quot;\n" + "data-animation=&quot;fade&quot;"} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm" />
        <p className="text-xs text-gray-500 mt-1">One attribute per line (e.g., data-scroll=&quot;true&quot;)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-aria`}>
          ARIA Label
        </label>
        <input id={`${baseId}-aria`} type="text" value={props.ariaLabel || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.ariaLabel = e.target.value))} placeholder="Descriptive label for screen readers" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
        <p className="text-xs text-gray-500 mt-1">Accessibility label for screen readers</p>
      </div>
    </div>
  );
};

// Reusable Info Notice Component
export const InfoNotice = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
    <p className="text-xs text-blue-700">{children}</p>
  </div>
);

// Reusable Position Controls Component
export const PositionControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "position" }: StyleControlProps) => (
  <>
    <div id={`position-controls-${controlId}`} data-component-id={`position-controls-${controlId}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
      <select value={props.position || "default"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.position = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Top</label>
            <div className="flex items-center gap-1">
              <input type="number" value={props.positionTop || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.positionTop = e.target.value))} placeholder="0" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
              <select value={props.positionTopUnit || "px"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.positionTopUnit = e.target.value))} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Right</label>
            <div className="flex items-center gap-1">
              <input type="number" value={props.positionRight || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.positionRight = e.target.value))} placeholder="0" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
              <select value={props.positionRightUnit || "px"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.positionRightUnit = e.target.value))} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bottom</label>
            <div className="flex items-center gap-1">
              <input type="number" value={props.positionBottom || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.positionBottom = e.target.value))} placeholder="0" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
              <select value={props.positionBottomUnit || "px"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.positionBottomUnit = e.target.value))} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Left</label>
            <div className="flex items-center gap-1">
              <input type="number" value={props.positionLeft || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.positionLeft = e.target.value))} placeholder="0" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
              <select value={props.positionLeftUnit || "px"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.positionLeftUnit = e.target.value))} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
        </div>
      </>
    )}

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Z-Index</label>
      <input type="number" value={props.zIndex || ""} onChange={(e) => actions.setProp((draft: typeof props) => (draft.zIndex = e.target.value))} placeholder="auto" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
    </div>

    <InfoNotice>Above setting will take effect only on preview or live page, and not while you&rsquo;re editing.</InfoNotice>
  </>
);

// Reusable Responsive Controls Component
export const ResponsiveControls: React.FC<StyleControlProps> = ({ props, actions, controlId = "responsive" }: StyleControlProps) => {
  const baseId = `responsive-controls-${controlId}`;

  const visibilityToggles = [
    {
      id: "desktop",
      label: "Hide on Desktop",
      helper: "Hide on screens 1024px and above",
      accessor: "hideOnDesktop" as const,
    },
    {
      id: "tablet",
      label: "Hide on Tablet",
      helper: "Hide on screens 768px to 1023px",
      accessor: "hideOnTablet" as const,
    },
    {
      id: "landscape",
      label: "Hide on Landscape Mobile",
      helper: "Hide on screens 480px to 767px",
      accessor: "hideOnLandscapeMobile" as const,
    },
    {
      id: "mobile",
      label: "Hide on Mobile",
      helper: "Hide on screens below 480px",
      accessor: "hideOnMobile" as const,
    },
  ];

  return (
    <>
      {visibilityToggles.map(({ id, label, helper, accessor }) => (
        <div key={id} id={`${baseId}-${id}`} data-component-id={`${baseId}-${id}`}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={Boolean(props[accessor])} onChange={(event) => actions.setProp((draft: typeof props) => (draft[accessor] = event.target.checked))} className="sr-only peer" />
              <div className={'w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600'}></div>
            </label>
          </div>
          <p className="text-xs text-gray-500">{helper}</p>
        </div>
      ))}

      <InfoNotice>Above setting will take effect only on preview or live page, and not while you&rsquo;re editing.</InfoNotice>
    </>
  );
};
