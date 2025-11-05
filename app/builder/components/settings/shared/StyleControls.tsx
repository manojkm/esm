"use client";

import React from "react";

// Reusable Color Input Component
export const ColorInput = ({ label, value, onChange, placeholder = "#000000" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex gap-2">
      <input type="color" value={value || placeholder} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 flex-shrink-0 border border-gray-300 rounded-full cursor-pointer appearance-none" />
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value || null)} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder={placeholder} />
    </div>
  </div>
);

// Background Controls Component
export const BackgroundControls = ({ props, actions }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
      <div className="grid grid-cols-3 gap-1">
        {["color", "gradient", "image"].map((type) => {
          const isActive = props.backgroundType === type;
          return (
            <button
              key={type}
              onClick={() =>
                actions.setProp((props) => {
                  props.backgroundType = isActive ? null : type;
                })
              }
              className={`px-3 py-2 text-xs border rounded capitalize transition-colors ${isActive ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>

    {props.backgroundType === "color" && (
      <div className="space-y-3">
        <ColorInput label="Background Color" value={props.backgroundColor} onChange={(value) => actions.setProp((props) => (props.backgroundColor = value))} placeholder="#ffffff" />
        <ColorInput label="Hover Color" value={props.backgroundColorHover} onChange={(value) => actions.setProp((props) => (props.backgroundColorHover = value))} placeholder="#f0f0f0" />
      </div>
    )}

    {props.backgroundType === "gradient" && (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gradient</label>
          <input type="text" value={props.backgroundGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"} onChange={(e) => actions.setProp((props) => (props.backgroundGradient = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hover Gradient</label>
          <input type="text" value={props.backgroundGradientHover || "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"} onChange={(e) => actions.setProp((props) => (props.backgroundGradientHover = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="linear-gradient(135deg, #764ba2 0%, #667eea 100%)" />
        </div>
      </div>
    )}

    {props.backgroundType === "image" && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
        <input type="text" value={props.backgroundImage || ""} onChange={(e) => actions.setProp((props) => (props.backgroundImage = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="https://example.com/image.jpg" />
      </div>
    )}
  </div>
);

// Border Controls Component
export const BorderControls = ({ props, actions }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Border Style</label>
      <select value={props.borderStyle || "none"} onChange={(e) => actions.setProp((props) => (props.borderStyle = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm">
        <option value="none">None</option>
        <option value="solid">Solid</option>
        <option value="dotted">Dotted</option>
        <option value="dashed">Dashed</option>
        <option value="double">Double</option>
        <option value="groove">Groove</option>
        <option value="inset">Inset</option>
        <option value="outset">Outset</option>
        <option value="ridge">Ridge</option>
      </select>
    </div>

    {props.borderStyle && props.borderStyle !== "none" && (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Border Width</label>
          <div className="grid grid-cols-4 gap-1">
            {["Top", "Right", "Bottom", "Left"].map((side, index) => {
              const prop = `border${side}Width`;
              return (
                <div key={side}>
                  <label className="block text-xs text-gray-500 mb-1">{side}</label>
                  <input type="number" value={props[prop] ?? props.borderWidth ?? 1} onChange={(e) => actions.setProp((props) => (props[prop] = parseInt(e.target.value)))} className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <ColorInput label="Border Color" value={props.borderColor} onChange={(value) => actions.setProp((props) => (props.borderColor = value))} placeholder="#000000" />
          <ColorInput label="Hover Border Color" value={props.borderColorHover} onChange={(value) => actions.setProp((props) => (props.borderColorHover = value))} placeholder="#333333" />
        </div>
      </>
    )}

    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Border Radius</label>
        <select value={props.borderRadiusUnit || "px"} onChange={(e) => actions.setProp((props) => (props.borderRadiusUnit = e.target.value))} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white">
          <option value="px">px</option>
          <option value="%">%</option>
        </select>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map((corner, index) => {
          const prop = `border${corner}Radius`;
          const labels = ["Top", "Right", "Bottom", "Left"];
          return (
            <div key={corner}>
              <label className="block text-xs text-gray-500 mb-1">{labels[index]}</label>
              <input type="number" value={props[prop] ?? props.borderRadius ?? 0} onChange={(e) => actions.setProp((props) => (props[prop] = parseInt(e.target.value)))} className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// Box Shadow Controls Component
export const BoxShadowControls = ({ props, actions }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Preset</label>
      <div className="grid grid-cols-3 gap-2">
        {[
          { name: "None", value: null, shadow: "none" },
          { name: "Subtle", value: "subtle", shadow: "0 1px 3px rgba(0,0,0,0.1)" },
          { name: "Small", value: "small", shadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" },
          { name: "Medium", value: "medium", shadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)" },
          { name: "Large", value: "large", shadow: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)" },
          { name: "Extra Large", value: "xl", shadow: "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)" },
        ].map((preset) => (
          <button
            key={preset.value}
            onClick={() => {
              actions.setProp((props) => {
                props.boxShadowPreset = preset.value;
                if (preset.value === null) {
                  props.boxShadowHorizontal = 0;
                  props.boxShadowVertical = 0;
                  props.boxShadowBlur = 0;
                  props.boxShadowSpread = 0;
                  props.boxShadowHorizontalHover = 0;
                  props.boxShadowVerticalHover = 0;
                  props.boxShadowBlurHover = 0;
                  props.boxShadowSpreadHover = 0;
                } else if (preset.value === "subtle") {
                  props.boxShadowHorizontal = 0;
                  props.boxShadowVertical = 1;
                  props.boxShadowBlur = 3;
                  props.boxShadowSpread = 0;
                  props.boxShadowColor = "rgba(0, 0, 0, 0.1)";
                  props.boxShadowHorizontalHover = 0;
                  props.boxShadowVerticalHover = 2;
                  props.boxShadowBlurHover = 6;
                  props.boxShadowSpreadHover = 0;
                  props.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
                } else if (preset.value === "small") {
                  props.boxShadowHorizontal = 0;
                  props.boxShadowVertical = 1;
                  props.boxShadowBlur = 3;
                  props.boxShadowSpread = 0;
                  props.boxShadowColor = "rgba(0, 0, 0, 0.1)";
                  props.boxShadowHorizontalHover = 0;
                  props.boxShadowVerticalHover = 4;
                  props.boxShadowBlurHover = 8;
                  props.boxShadowSpreadHover = 0;
                  props.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
                } else if (preset.value === "medium") {
                  props.boxShadowHorizontal = 0;
                  props.boxShadowVertical = 4;
                  props.boxShadowBlur = 6;
                  props.boxShadowSpread = 0;
                  props.boxShadowColor = "rgba(0, 0, 0, 0.1)";
                  props.boxShadowHorizontalHover = 0;
                  props.boxShadowVerticalHover = 8;
                  props.boxShadowBlurHover = 15;
                  props.boxShadowSpreadHover = 0;
                  props.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
                } else if (preset.value === "large") {
                  props.boxShadowHorizontal = 0;
                  props.boxShadowVertical = 10;
                  props.boxShadowBlur = 15;
                  props.boxShadowSpread = 0;
                  props.boxShadowColor = "rgba(0, 0, 0, 0.1)";
                  props.boxShadowHorizontalHover = 0;
                  props.boxShadowVerticalHover = 15;
                  props.boxShadowBlurHover = 25;
                  props.boxShadowSpreadHover = 0;
                  props.boxShadowColorHover = "rgba(0, 0, 0, 0.2)";
                } else if (preset.value === "xl") {
                  props.boxShadowHorizontal = 0;
                  props.boxShadowVertical = 20;
                  props.boxShadowBlur = 25;
                  props.boxShadowSpread = 0;
                  props.boxShadowColor = "rgba(0, 0, 0, 0.1)";
                  props.boxShadowHorizontalHover = 0;
                  props.boxShadowVerticalHover = 25;
                  props.boxShadowBlurHover = 50;
                  props.boxShadowSpreadHover = 0;
                  props.boxShadowColorHover = "rgba(0, 0, 0, 0.25)";
                }
              });
            }}
            className={`p-3 text-xs border rounded text-center transition-colors ${(props.boxShadowPreset || null) === preset.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            style={{ boxShadow: preset.shadow }}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Normal Shadow</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <input type="text" value={props.boxShadowColor || "rgba(0, 0, 0, 0.1)"} onChange={(e) => actions.setProp((props) => (props.boxShadowColor = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="rgba(0, 0, 0, 0.1)" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {["Horizontal", "Vertical", "Blur", "Spread"].map((prop, index) => {
          const propName = `boxShadow${prop}`;
          const defaultValues = [0, 0, 0, 0];
          return (
            <div key={prop}>
              <label className="block text-xs text-gray-500 mb-1">{prop}</label>
              <input type="number" value={props[propName] ?? defaultValues[index]} onChange={(e) => actions.setProp((props) => (props[propName] = parseInt(e.target.value)))} className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
            </div>
          );
        })}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
        <div className="grid grid-cols-2 gap-1">
          {["outset", "inset"].map((position) => (
            <button key={position} onClick={() => actions.setProp((props) => (props.boxShadowPosition = position))} className={`px-3 py-2 text-xs border rounded capitalize ${(props.boxShadowPosition || "outset") === position ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
              {position}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Hover Shadow</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hover Color</label>
        <input type="text" value={props.boxShadowColorHover || "rgba(0, 0, 0, 0.15)"} onChange={(e) => actions.setProp((props) => (props.boxShadowColorHover = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="rgba(0, 0, 0, 0.15)" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {["Horizontal", "Vertical", "Blur", "Spread"].map((prop, index) => {
          const propName = `boxShadow${prop}Hover`;
          const defaultValues = [0, 0, 0, 0];
          return (
            <div key={prop}>
              <label className="block text-xs text-gray-500 mb-1">{prop}</label>
              <input type="number" value={props[propName] ?? defaultValues[index]} onChange={(e) => actions.setProp((props) => (props[propName] = parseInt(e.target.value)))} className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
            </div>
          );
        })}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hover Position</label>
        <div className="grid grid-cols-2 gap-1">
          {["outset", "inset"].map((position) => (
            <button key={position} onClick={() => actions.setProp((props) => (props.boxShadowPositionHover = position))} className={`px-3 py-2 text-xs border rounded capitalize ${(props.boxShadowPositionHover || "outset") === position ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
              {position}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Spacing Controls Component
export const SpacingControls = ({ props, actions }) => (
  <div className="space-y-4">
    {/* Gap Controls - Only for Flex Layout */}
    {props.layout === "flex" && (
      <>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Row Gap</label>
            <button
              onClick={() =>
                actions.setProp((props) => {
                  props.rowGap = 20;
                })
              }
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Reset
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="100" value={props.rowGap !== undefined ? props.rowGap : 20} onChange={(e) => actions.setProp((props) => (props.rowGap = parseInt(e.target.value)))} className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <input type="number" value={props.rowGap !== undefined ? props.rowGap : 20} onChange={(e) => actions.setProp((props) => (props.rowGap = parseInt(e.target.value)))} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
            <select value={props.rowGapUnit || "px"} onChange={(e) => actions.setProp((props) => (props.rowGapUnit = e.target.value))} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
              <option value="px">px</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Column Gap</label>
            <button
              onClick={() =>
                actions.setProp((props) => {
                  props.columnGap = 20;
                })
              }
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Reset
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="100" value={props.columnGap !== undefined ? props.columnGap : 20} onChange={(e) => actions.setProp((props) => (props.columnGap = parseInt(e.target.value)))} className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <input type="number" value={props.columnGap !== undefined ? props.columnGap : 20} onChange={(e) => actions.setProp((props) => (props.columnGap = parseInt(e.target.value)))} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
            <select value={props.columnGapUnit || "px"} onChange={(e) => actions.setProp((props) => (props.columnGapUnit = e.target.value))} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
              <option value="px">px</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>
      </>
    )}

    {/* Padding Controls */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Padding</label>
        <select value={props.paddingUnit || "px"} onChange={(e) => actions.setProp((props) => (props.paddingUnit = e.target.value))} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white">
          <option value="px">px</option>
          <option value="%">%</option>
        </select>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {["Top", "Right", "Bottom", "Left"].map((side) => {
          const prop = `padding${side}`;
          return (
            <div key={side}>
              <label className="block text-xs text-gray-500 mb-1">{side}</label>
              <input type="number" value={props[prop] ?? props.padding ?? 0} onChange={(e) => actions.setProp((props) => (props[prop] = parseInt(e.target.value)))} className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
            </div>
          );
        })}
      </div>
    </div>

    {/* Margin Controls */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Margin</label>
        <select value={props.marginUnit || "px"} onChange={(e) => actions.setProp((props) => (props.marginUnit = e.target.value))} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white">
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="auto">auto</option>
        </select>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {["Top", "Right", "Bottom", "Left"].map((side) => {
          const prop = `margin${side}`;
          return (
            <div key={side}>
              <label className="block text-xs text-gray-500 mb-1">{side}</label>
              <input type="number" value={props[prop] ?? props.margin ?? 0} onChange={(e) => actions.setProp((props) => (props[prop] = parseInt(e.target.value)))} className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// Color Controls Component
export const ColorControls = ({ props, actions }) => (
  <div className="space-y-4">
    <ColorInput label="Text Color" value={props.textColor} onChange={(value) => actions.setProp((props) => (props.textColor = value))} placeholder="#000000 or inherit" />

    <div className="space-y-3">
      <ColorInput label="Link Color" value={props.linkColor} onChange={(value) => actions.setProp((props) => (props.linkColor = value))} placeholder="#0066cc or inherit" />
      <ColorInput label="Link Hover Color" value={props.linkColorHover} onChange={(value) => actions.setProp((props) => (props.linkColorHover = value))} placeholder="#004499 or inherit" />
    </div>
  </div>
);
