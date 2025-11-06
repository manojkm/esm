"use client";

import React from "react";
import { Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";

// Reusable Color Input Component
export const ColorInput = ({ label, value, onChange, placeholder = "#000000", responsive = false }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  if (responsive) {
    const responsiveValue = getResponsiveValue(value || {}, null);
    const hasCustomValue = responsiveValue !== null;
    
    const handleResponsiveChange = (newValue) => {
      const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, newValue);
      onChange(updatedValues);
    };
    
    const handleReset = () => {
      const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, null);
      onChange(updatedValues);
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            {label}
            <span className="ml-2 text-blue-600">
              {currentBreakpoint === 'desktop' && <Monitor size={12} />}
              {currentBreakpoint === 'tablet' && <Tablet size={12} />}
              {currentBreakpoint === 'mobile' && <Smartphone size={12} />}
            </span>
          </label>
          {hasCustomValue && (
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Reset to default"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <input type="color" value={responsiveValue || placeholder} onChange={(e) => handleResponsiveChange(e.target.value)} className="w-10 h-10 flex-shrink-0 border border-gray-300 rounded-full cursor-pointer appearance-none" />
          <input type="text" value={responsiveValue || ""} onChange={(e) => handleResponsiveChange(e.target.value || null)} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder={placeholder} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2">
        <input type="color" value={value || placeholder} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 flex-shrink-0 border border-gray-300 rounded-full cursor-pointer appearance-none" />
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value || null)} className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder={placeholder} />
      </div>
    </div>
  );
};

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
        <ColorInput label="Background Color" value={props.backgroundColorResponsive} onChange={(value) => actions.setProp((props) => (props.backgroundColorResponsive = value))} placeholder="#ffffff" responsive={true} />
        <ColorInput label="Hover Color" value={props.backgroundColorHoverResponsive} onChange={(value) => actions.setProp((props) => (props.backgroundColorHoverResponsive = value))} placeholder="#f0f0f0" responsive={true} />
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
        <ResponsiveSpacingControl 
          label="Border Width" 
          value={props.borderWidthResponsive} 
          onChange={(value) => actions.setProp((props) => (props.borderWidthResponsive = value))} 
          unitOptions={["px"]} 
          defaultValue={1} 
        />

        <div className="space-y-3">
          <ColorInput label="Border Color" value={props.borderColorResponsive} onChange={(value) => actions.setProp((props) => (props.borderColorResponsive = value))} placeholder="#000000" responsive={true} />
          <ColorInput label="Hover Border Color" value={props.borderColorHoverResponsive} onChange={(value) => actions.setProp((props) => (props.borderColorHoverResponsive = value))} placeholder="#333333" responsive={true} />
        </div>
      </>
    )}

    <ResponsiveSpacingControl 
      label="Border Radius" 
      value={props.borderRadiusResponsive} 
      onChange={(value) => actions.setProp((props) => (props.borderRadiusResponsive = value))} 
      unitOptions={["px", "%"]} 
      defaultValue={0} 
    />
  </div>
);

// Box Shadow Controls Component
export const BoxShadowControls = ({ props, actions }) => {
  const [activeTab, setActiveTab] = React.useState("normal");
  
  return (
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
                  // Update responsive values for current breakpoint
                  const currentBreakpoint = 'desktop'; // Default to desktop for presets
                  
                  if (preset.value === null) {
                    props.boxShadowHorizontalResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowBlurResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowSpreadResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowHorizontalHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowSpreadHoverResponsive = { [currentBreakpoint]: 0 };
                  } else if (preset.value === "subtle") {
                    props.boxShadowHorizontalResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalResponsive = { [currentBreakpoint]: 1 };
                    props.boxShadowBlurResponsive = { [currentBreakpoint]: 3 };
                    props.boxShadowSpreadResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowColor = "rgba(0, 0, 0, 0.1)";
                    props.boxShadowHorizontalHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 2 };
                    props.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 6 };
                    props.boxShadowSpreadHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
                  } else if (preset.value === "small") {
                    props.boxShadowHorizontalResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalResponsive = { [currentBreakpoint]: 1 };
                    props.boxShadowBlurResponsive = { [currentBreakpoint]: 3 };
                    props.boxShadowSpreadResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowColor = "rgba(0, 0, 0, 0.1)";
                    props.boxShadowHorizontalHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 4 };
                    props.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 8 };
                    props.boxShadowSpreadHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
                  } else if (preset.value === "medium") {
                    props.boxShadowHorizontalResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalResponsive = { [currentBreakpoint]: 4 };
                    props.boxShadowBlurResponsive = { [currentBreakpoint]: 6 };
                    props.boxShadowSpreadResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowColor = "rgba(0, 0, 0, 0.1)";
                    props.boxShadowHorizontalHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 8 };
                    props.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 15 };
                    props.boxShadowSpreadHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowColorHover = "rgba(0, 0, 0, 0.15)";
                  } else if (preset.value === "large") {
                    props.boxShadowHorizontalResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalResponsive = { [currentBreakpoint]: 10 };
                    props.boxShadowBlurResponsive = { [currentBreakpoint]: 15 };
                    props.boxShadowSpreadResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowColor = "rgba(0, 0, 0, 0.1)";
                    props.boxShadowHorizontalHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 15 };
                    props.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 25 };
                    props.boxShadowSpreadHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowColorHover = "rgba(0, 0, 0, 0.2)";
                  } else if (preset.value === "xl") {
                    props.boxShadowHorizontalResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalResponsive = { [currentBreakpoint]: 20 };
                    props.boxShadowBlurResponsive = { [currentBreakpoint]: 25 };
                    props.boxShadowSpreadResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowColor = "rgba(0, 0, 0, 0.1)";
                    props.boxShadowHorizontalHoverResponsive = { [currentBreakpoint]: 0 };
                    props.boxShadowVerticalHoverResponsive = { [currentBreakpoint]: 25 };
                    props.boxShadowBlurHoverResponsive = { [currentBreakpoint]: 50 };
                    props.boxShadowSpreadHoverResponsive = { [currentBreakpoint]: 0 };
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

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("normal")}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "normal"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => setActiveTab("hover")}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "hover"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Hover
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "normal" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <input type="text" value={props.boxShadowColor || "rgba(0, 0, 0, 0.1)"} onChange={(e) => actions.setProp((props) => (props.boxShadowColor = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="rgba(0, 0, 0, 0.1)" />
          </div>
          <div className="space-y-3">
            <ResponsiveNumberInput label="Horizontal" value={props.boxShadowHorizontalResponsive} onChange={(value) => actions.setProp((props) => (props.boxShadowHorizontalResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
            <ResponsiveNumberInput label="Vertical" value={props.boxShadowVerticalResponsive} onChange={(value) => actions.setProp((props) => (props.boxShadowVerticalResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
            <ResponsiveNumberInput label="Blur" value={props.boxShadowBlurResponsive} onChange={(value) => actions.setProp((props) => (props.boxShadowBlurResponsive = value))} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
            <ResponsiveNumberInput label="Spread" value={props.boxShadowSpreadResponsive} onChange={(value) => actions.setProp((props) => (props.boxShadowSpreadResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
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
      )}

      {activeTab === "hover" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hover Color</label>
            <input type="text" value={props.boxShadowColorHover || "rgba(0, 0, 0, 0.15)"} onChange={(e) => actions.setProp((props) => (props.boxShadowColorHover = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" placeholder="rgba(0, 0, 0, 0.15)" />
          </div>
          <div className="space-y-3">
            <ResponsiveNumberInput label="Horizontal" value={props.boxShadowHorizontalHoverResponsive} onChange={(value) => actions.setProp((props) => (props.boxShadowHorizontalHoverResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
            <ResponsiveNumberInput label="Vertical" value={props.boxShadowVerticalHoverResponsive} onChange={(value) => actions.setProp((props) => (props.boxShadowVerticalHoverResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
            <ResponsiveNumberInput label="Blur" value={props.boxShadowBlurHoverResponsive} onChange={(value) => actions.setProp((props) => (props.boxShadowBlurHoverResponsive = value))} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
            <ResponsiveNumberInput label="Spread" value={props.boxShadowSpreadHoverResponsive} onChange={(value) => actions.setProp((props) => (props.boxShadowSpreadHoverResponsive = value))} min={-100} max={100} unit="px" unitOptions={["px"]} defaultValue={0} />
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
      )}
    </div>
  );
};

// Responsive Number Input Component
export const ResponsiveNumberInput = ({ label, value, onChange, min = 0, max = 1000, unit = "px", unitOptions = ["px", "%"], defaultValue = 0 }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  const responsiveValue = getResponsiveValue(value || {}, defaultValue);
  const responsiveUnit = getResponsiveValue(value?.unit || {}, unit);

  const handleValueChange = (newValue) => {
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, newValue);
    onChange(updatedValues);
  };
  
  const handleThrottledChange = (newValue) => {
    // Use throttled history for rapid changes like slider movements
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, newValue);
    onChange(updatedValues, true); // Pass throttle flag
  };

  const handleUnitChange = (newUnit) => {
    const updatedUnits = setResponsiveValue(value?.unit || {}, currentBreakpoint, newUnit);
    onChange({ ...value, unit: updatedUnits });
  };

  const hasCustomValue = responsiveValue !== defaultValue;
  
  const handleReset = () => {
    const updatedValues = setResponsiveValue(value || {}, currentBreakpoint, defaultValue);
    onChange(updatedValues);
  };
  
  const showUnitSelector = unitOptions.length > 1;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          {label}
          <span className="ml-2 text-blue-600">
            {currentBreakpoint === 'desktop' && <Monitor size={12} />}
            {currentBreakpoint === 'tablet' && <Tablet size={12} />}
            {currentBreakpoint === 'mobile' && <Smartphone size={12} />}
          </span>
        </label>
        {hasCustomValue && (
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Reset to default"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={responsiveValue} onChange={(e) => handleThrottledChange(parseInt(e.target.value))} className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        <input type="number" value={responsiveValue} onChange={(e) => handleValueChange(parseInt(e.target.value))} className={`w-16 px-2 py-1 text-xs border border-gray-300 text-gray-900 bg-white ${showUnitSelector ? 'rounded-l' : 'rounded'}`} />
        {showUnitSelector && (
          <select value={responsiveUnit} onChange={(e) => handleUnitChange(e.target.value)} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
            {unitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
        {!showUnitSelector && (
          <span className="px-2 py-1 text-xs text-gray-500">{unit}</span>
        )}
      </div>
    </div>
  );
};

// Responsive Spacing Control Component
export const ResponsiveSpacingControl = ({ label, value, onChange, unitOptions = ["px", "%"], defaultValue = 0 }) => {
  const { currentBreakpoint, getResponsiveValue, setResponsiveValue } = useResponsive();

  const getValue = (side) => {
    const sideValues = value?.[side] || {};
    return getResponsiveValue(sideValues, defaultValue);
  };

  const getUnit = () => {
    const unitValues = value?.unit || {};
    return getResponsiveValue(unitValues, "px");
  };

  const setValue = (side, newValue) => {
    const currentSideValues = value?.[side] || {};
    const updatedSideValues = setResponsiveValue(currentSideValues, currentBreakpoint, newValue);
    onChange({ ...value, [side]: updatedSideValues });
  };

  const setUnit = (newUnit) => {
    const currentUnitValues = value?.unit || {};
    const updatedUnitValues = setResponsiveValue(currentUnitValues, currentBreakpoint, newUnit);
    onChange({ ...value, unit: updatedUnitValues });
  };

  const hasCustomValues = ['top', 'right', 'bottom', 'left'].some(side => getValue(side) !== defaultValue);
  
  const handleReset = () => {
    const resetValues = {};
    ['top', 'right', 'bottom', 'left'].forEach(side => {
      const currentSideValues = value?.[side] || {};
      resetValues[side] = setResponsiveValue(currentSideValues, currentBreakpoint, defaultValue);
    });
    onChange({ ...value, ...resetValues });
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          {label}
          <span className="ml-2 text-blue-600">
            {currentBreakpoint === 'desktop' && <Monitor size={12} />}
            {currentBreakpoint === 'tablet' && <Tablet size={12} />}
            {currentBreakpoint === 'mobile' && <Smartphone size={12} />}
          </span>
        </label>
        <div className="flex items-center gap-2">
          {hasCustomValues && (
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Reset to default"
            >
              <RotateCcw size={14} />
            </button>
          )}
          <select value={getUnit()} onChange={(e) => setUnit(e.target.value)} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white">
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
            <label className="block text-xs text-gray-500 mb-1 capitalize">{side}</label>
            <input type="number" value={getValue(side)} onChange={(e) => setValue(side, parseInt(e.target.value))} className="w-full px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Spacing Controls Component
export const SpacingControls = ({ props, actions }) => (
  <div className="space-y-4">
    {/* Gap Controls - Only for Flex Layout */}
    {props.layout === "flex" && (
      <>
        <ResponsiveNumberInput label="Row Gap" value={props.rowGapResponsive} onChange={(value) => actions.setProp((props) => (props.rowGapResponsive = value))} max={100} unitOptions={["px", "%"]} defaultValue={20} />

        <ResponsiveNumberInput label="Column Gap" value={props.columnGapResponsive} onChange={(value) => actions.setProp((props) => (props.columnGapResponsive = value))} max={100} unitOptions={["px", "%"]} defaultValue={20} />
      </>
    )}

    {/* Padding Controls */}
    <ResponsiveSpacingControl label="Padding" value={props.paddingResponsive} onChange={(value) => actions.setProp((props) => (props.paddingResponsive = value))} defaultValue={10} />

    {/* Margin Controls */}
    <ResponsiveSpacingControl label="Margin" value={props.marginResponsive} onChange={(value) => actions.setProp((props) => (props.marginResponsive = value))} unitOptions={["px", "%", "auto"]} />
  </div>
);

// Color Controls Component
export const ColorControls = ({ props, actions }) => (
  <div className="space-y-4">
    <ColorInput label="Text Color" value={props.textColorResponsive} onChange={(value) => actions.setProp((props) => (props.textColorResponsive = value))} placeholder="#000000 or inherit" responsive={true} />

    <div className="space-y-3">
      <ColorInput label="Link Color" value={props.linkColorResponsive} onChange={(value) => actions.setProp((props) => (props.linkColorResponsive = value))} placeholder="#0066cc or inherit" responsive={true} />
      <ColorInput label="Link Hover Color" value={props.linkColorHoverResponsive} onChange={(value) => actions.setProp((props) => (props.linkColorHoverResponsive = value))} placeholder="#004499 or inherit" responsive={true} />
    </div>
  </div>
);

// Reusable CSS Controls Component
export const CSSControls = ({ props, actions }) => (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">CSS Classes</label>
      <input type="text" value={props.className || ""} onChange={(e) => actions.setProp((props) => (props.className = e.target.value))} placeholder="custom-class another-class" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
      <p className="text-xs text-gray-500 mt-1">Add custom CSS classes separated by spaces</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">CSS ID</label>
      <input type="text" value={props.cssId || ""} onChange={(e) => actions.setProp((props) => (props.cssId = e.target.value))} placeholder="unique-id" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
      <p className="text-xs text-gray-500 mt-1">Unique identifier for this element</p>
    </div>
  </>
);

// Reusable Attributes Controls Component
export const AttributesControls = ({ props, actions }) => (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Data Attributes</label>
      <textarea
        value={props.dataAttributes || ""}
        onChange={(e) => actions.setProp((props) => (props.dataAttributes = e.target.value))}
        placeholder='data-scroll="true"&#10;data-animation="fade"'
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm"
      />
      <p className="text-xs text-gray-500 mt-1">One attribute per line (e.g., data-scroll="true")</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">ARIA Label</label>
      <input type="text" value={props.ariaLabel || ""} onChange={(e) => actions.setProp((props) => (props.ariaLabel = e.target.value))} placeholder="Descriptive label for screen readers" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
      <p className="text-xs text-gray-500 mt-1">Accessibility label for screen readers</p>
    </div>
  </>
);

// Reusable Info Notice Component
export const InfoNotice = ({ children }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
    <p className="text-xs text-blue-700">{children}</p>
  </div>
);

// Reusable Position Controls Component
export const PositionControls = ({ props, actions }) => (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
      <select value={props.position || "default"} onChange={(e) => actions.setProp((props) => (props.position = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm">
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
              <input type="number" value={props.positionTop || ""} onChange={(e) => actions.setProp((props) => (props.positionTop = e.target.value))} placeholder="0" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
              <select value={props.positionTopUnit || "px"} onChange={(e) => actions.setProp((props) => (props.positionTopUnit = e.target.value))} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Right</label>
            <div className="flex items-center gap-1">
              <input type="number" value={props.positionRight || ""} onChange={(e) => actions.setProp((props) => (props.positionRight = e.target.value))} placeholder="0" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
              <select value={props.positionRightUnit || "px"} onChange={(e) => actions.setProp((props) => (props.positionRightUnit = e.target.value))} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bottom</label>
            <div className="flex items-center gap-1">
              <input type="number" value={props.positionBottom || ""} onChange={(e) => actions.setProp((props) => (props.positionBottom = e.target.value))} placeholder="0" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
              <select value={props.positionBottomUnit || "px"} onChange={(e) => actions.setProp((props) => (props.positionBottomUnit = e.target.value))} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Left</label>
            <div className="flex items-center gap-1">
              <input type="number" value={props.positionLeft || ""} onChange={(e) => actions.setProp((props) => (props.positionLeft = e.target.value))} placeholder="0" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
              <select value={props.positionLeftUnit || "px"} onChange={(e) => actions.setProp((props) => (props.positionLeftUnit = e.target.value))} className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white">
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
      <input type="number" value={props.zIndex || ""} onChange={(e) => actions.setProp((props) => (props.zIndex = e.target.value))} placeholder="auto" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
    </div>

    <InfoNotice>Above setting will take effect only on preview or live page, and not while you're editing.</InfoNotice>
  </>
);

// Reusable Responsive Controls Component
export const ResponsiveControls = ({ props, actions }) => (
  <>
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Hide on Desktop</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={props.hideOnDesktop || false} onChange={(e) => actions.setProp((props) => (props.hideOnDesktop = e.target.checked))} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <p className="text-xs text-gray-500">Hide on screens 1024px and above</p>
    </div>

    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Hide on Tablet</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={props.hideOnTablet || false} onChange={(e) => actions.setProp((props) => (props.hideOnTablet = e.target.checked))} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <p className="text-xs text-gray-500">Hide on screens 768px to 1023px</p>
    </div>

    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Hide on Landscape Mobile</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={props.hideOnLandscapeMobile || false} onChange={(e) => actions.setProp((props) => (props.hideOnLandscapeMobile = e.target.checked))} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <p className="text-xs text-gray-500">Hide on screens 480px to 767px</p>
    </div>

    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Hide on Mobile</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={props.hideOnMobile || false} onChange={(e) => actions.setProp((props) => (props.hideOnMobile = e.target.checked))} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <p className="text-xs text-gray-500">Hide on screens below 480px</p>
    </div>

    <InfoNotice>Above setting will take effect only on preview or live page, and not while you're editing.</InfoNotice>
  </>
);
