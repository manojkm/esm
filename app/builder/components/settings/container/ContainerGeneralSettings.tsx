import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import { LayoutControls } from "../shared/LayoutControls";
import type { ContainerProps } from "../../ui/Container";
import type { ContainerControlActions } from "../shared/types";

interface ContainerGeneralSettingsProps {
  props: ContainerProps;
  actions: ContainerControlActions;
  isChildContainer: boolean;
}

const CHILD_WIDTH_DEFAULTS = {
  "%": 100,
  px: 320,
} as const;

export const ContainerGeneralSettings: React.FC<ContainerGeneralSettingsProps> = ({ props, actions, isChildContainer }) => {
  const [openAccordion, setOpenAccordion] = useState<"containerType" | "layout" | "">("containerType");

  const renderChildContainerControls = () => {
    const widthUnit = props.flexBasisUnit ?? "%";
    const widthDefaults = CHILD_WIDTH_DEFAULTS[widthUnit as keyof typeof CHILD_WIDTH_DEFAULTS] ?? CHILD_WIDTH_DEFAULTS["%"];

    return (
      <>
        <DimensionControl
          controlId="child-width"
          label="Custom Width"
          value={props.flexBasis ?? widthDefaults}
          unit={widthUnit}
          unitOptions={[
            { value: "%", label: "%" },
            { value: "px", label: "px" },
          ]}
          minMaxByUnit={{
            "%": { min: 1, max: 100 },
            px: { min: 20, max: 1600 },
          }}
          defaultValues={{
            "%": 100,
            px: 320,
          }}
          onValueChange={(value, unit) =>
            actions.setProp((draft: typeof props) => {
              const { min, max } = unit === "%" ? { min: 1, max: 100 } : { min: 20, max: 1600 };
              const clamped = Math.min(max, Math.max(min, Math.round(value)));
              draft.flexBasis = clamped;
              draft.flexBasisUnit = unit;
            })
          }
          onUnitChange={(unit, defaultValue) =>
            actions.setProp((draft: typeof props) => {
              draft.flexBasisUnit = unit;
              draft.flexBasis = defaultValue;
            })
          }
          showReset={Boolean(props.flexBasis && props.flexBasis !== (props.flexBasisUnit === "%" ? 100 : 320))}
          onReset={() =>
            actions.setProp((draft: typeof props) => {
              draft.flexBasis = draft.flexBasisUnit === "%" ? 100 : 320;
            })
          }
        />
        <MinHeightControls props={props} actions={actions} />
        <EqualHeightToggle props={props} actions={actions} />
        <HtmlTagSelect props={props} actions={actions} />
        <OverflowSelect props={props} actions={actions} />
      </>
    );
  };

  const renderParentContainerControls = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Container Width</label>
        <div className="grid grid-cols-3 gap-1">
          {["full", "boxed", "custom"].map((width) => (
            <button key={width} onClick={() => actions.setProp((draft: typeof props) => (draft.containerWidth = width))} className={`px-3 py-2 text-xs border rounded capitalize ${(props.containerWidth || "full") === width ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
              {width === "full" ? "Full Width" : width}
            </button>
          ))}
        </div>
      </div>

      {props.containerWidth === "custom" && (
        <DimensionControl
          controlId="custom-width"
          label="Custom Width"
          value={props.customWidth ?? (props.customWidthUnit === "%" ? 100 : 1200)}
          unit={props.customWidthUnit || "px"}
          unitOptions={[
            { value: "px", label: "px" },
            { value: "%", label: "%" },
          ]}
          minMaxByUnit={{
            px: { min: 100, max: 1600 },
            "%": { min: 10, max: 100 },
          }}
          defaultValues={{
            px: 1200,
            "%": 100,
          }}
          onValueChange={(value, unit) =>
            actions.setProp((draft: typeof props) => {
              const { min, max } = unit === "%" ? { min: 10, max: 100 } : { min: 100, max: 1600 };
              const clamped = Math.min(max, Math.max(min, Math.round(value)));
              draft.customWidth = clamped;
              draft.customWidthUnit = unit;
            })
          }
          onUnitChange={(unit, defaultValue) =>
            actions.setProp((draft: typeof props) => {
              draft.customWidthUnit = unit;
              draft.customWidth = defaultValue;
            })
          }
          showReset={Boolean(props.customWidth && props.customWidth !== (props.customWidthUnit === "%" ? 100 : 1200))}
          onReset={() =>
            actions.setProp((draft: typeof props) => {
              draft.customWidth = draft.customWidthUnit === "%" ? 100 : 1200;
            })
          }
        />
      )}

      {(props.containerWidth === "full" || !props.containerWidth) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content Width</label>
          <div className="grid grid-cols-2 gap-1">
            {["boxed", "full"].map((contentWidth) => (
              <button key={contentWidth} onClick={() => actions.setProp((draft: typeof props) => (draft.contentWidth = contentWidth))} className={`px-3 py-2 text-xs border rounded capitalize ${(props.contentWidth || "boxed") === contentWidth ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                {contentWidth === "full" ? "Full Width" : "Boxed"}
              </button>
            ))}
          </div>
        </div>
      )}

      {(props.containerWidth === "full" || !props.containerWidth) && (props.contentWidth === "boxed" || !props.contentWidth) && (
        <DimensionControl
          controlId="content-box-width"
          label="Content Box Width"
          value={props.contentBoxWidth ?? (props.contentBoxWidthUnit === "%" ? 100 : 1200)}
          unit={props.contentBoxWidthUnit || "px"}
          unitOptions={[
            { value: "px", label: "px" },
            { value: "%", label: "%" },
          ]}
          minMaxByUnit={{
            px: { min: 100, max: 1600 },
            "%": { min: 10, max: 100 },
          }}
          defaultValues={{
            px: 1200,
            "%": 100,
          }}
          onValueChange={(value, unit) =>
            actions.setProp((draft: typeof props) => {
              const { min, max } = unit === "%" ? { min: 10, max: 100 } : { min: 100, max: 1600 };
              const clamped = Math.min(max, Math.max(min, Math.round(value)));
              draft.contentBoxWidth = clamped;
              draft.contentBoxWidthUnit = unit;
            })
          }
          onUnitChange={(unit, defaultValue) =>
            actions.setProp((draft: typeof props) => {
              draft.contentBoxWidthUnit = unit;
              draft.contentBoxWidth = defaultValue;
            })
          }
          showReset={Boolean(props.contentBoxWidth && props.contentBoxWidth !== (props.contentBoxWidthUnit === "%" ? 100 : 1200))}
          onReset={() =>
            actions.setProp((draft: typeof props) => {
              draft.contentBoxWidth = draft.contentBoxWidthUnit === "%" ? 100 : 1200;
            })
          }
        />
      )}

      <MinHeightControls props={props} actions={actions} />
      <EqualHeightToggle props={props} actions={actions} />
      <HtmlTagSelect props={props} actions={actions} />
      <OverflowSelect props={props} actions={actions} />
    </>
  );

  const renderLayoutControls = () => <LayoutControls controlId="container-layout" props={props} actions={actions} isChildContainer={isChildContainer} />;

  return (
    <div className="space-y-4">
      <AccordionSection id="containerType" title="Container Type" isOpen={openAccordion === "containerType"} onToggle={() => setOpenAccordion(openAccordion === "containerType" ? "" : "containerType")}>
        <div className="space-y-3">{isChildContainer ? renderChildContainerControls() : renderParentContainerControls()}</div>
      </AccordionSection>

      <AccordionSection id="layout" title="Layout" isOpen={openAccordion === "layout"} onToggle={() => setOpenAccordion(openAccordion === "layout" ? "" : "layout")}>
        {renderLayoutControls()}
      </AccordionSection>
    </div>
  );
};

interface AccordionSectionProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, isOpen, onToggle, children }) => (
  <div className="border border-gray-200 rounded-md">
    <button onClick={onToggle} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
      {title}
      <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
    </button>
    {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
  </div>
);

interface ControlProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
}

interface DimensionControlProps {
  controlId: string;
  label: string;
  value: number;
  unit: string;
  unitOptions: Array<{ value: string; label: string }>;
  minMaxByUnit: Record<string, { min: number; max: number }>;
  defaultValues: Record<string, number>;
  onValueChange: (value: number, unit: string) => void;
  onUnitChange: (unit: string, defaultValue: number) => void;
  showReset?: boolean;
  onReset?: () => void;
}

export const DimensionControl: React.FC<DimensionControlProps> = ({ controlId, label, value, unit, unitOptions, minMaxByUnit, defaultValues, onValueChange, onUnitChange, showReset = false, onReset }) => {
  const resolvedUnit = unitOptions.find((option) => option.value === unit)?.value || unitOptions[0]?.value || "px";
  const unitConfig = minMaxByUnit[resolvedUnit] ?? { min: 0, max: 1000 };
  const defaultValue = defaultValues[resolvedUnit] ?? unitConfig.min;
  const numericValue = Number.isFinite(value) ? Number(value) : defaultValue;
  const clampedValue = Math.min(unitConfig.max, Math.max(unitConfig.min, Math.round(numericValue)));
  const baseId = `dimension-control-${controlId}`;

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    const clamped = Math.min(unitConfig.max, Math.max(unitConfig.min, Math.round(next)));
    onValueChange(clamped, resolvedUnit);
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (!Number.isFinite(next)) {
      onValueChange(defaultValue, resolvedUnit);
      return;
    }
    const clamped = Math.min(unitConfig.max, Math.max(unitConfig.min, Math.round(next)));
    onValueChange(clamped, resolvedUnit);
  };

  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextUnit = event.target.value;
    const fallbackDefault = defaultValues[nextUnit] ?? minMaxByUnit[nextUnit]?.min ?? defaultValue;
    onUnitChange(nextUnit, fallbackDefault);
  };

  return (
    <div id={baseId} data-component-id={baseId}>
      <div className="flex items-center justify-between mb-2">
        <label id={`${baseId}-label`} className="text-sm font-medium text-gray-700" htmlFor={`${baseId}-number`}>
          {label}
        </label>
        {showReset && onReset && (
          <button onClick={onReset} className="text-gray-400 hover:text-gray-600 transition-colors" title="Reset to default" aria-controls={baseId}>
            <RotateCcw size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input id={`${baseId}-range`} type="range" min={unitConfig.min} max={unitConfig.max} value={clampedValue} onChange={handleRangeChange} className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" aria-labelledby={`${baseId}-label`} />
        <div className="flex items-center gap-1">
          <input id={`${baseId}-number`} type="number" value={clampedValue} min={unitConfig.min} max={unitConfig.max} onChange={handleNumberChange} className="w-20 px-2 py-1 text-sm border border-gray-300 rounded text-gray-900 bg-white" />
          <select id={`${baseId}-unit`} value={resolvedUnit} onChange={handleUnitChange} className="px-2 py-1 text-sm border border-gray-300 rounded text-gray-900 bg-white">
            {unitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export const MinHeightControls: React.FC<ControlProps> = ({ props, actions }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm font-medium text-gray-700">Minimum Height</label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={props.enableMinHeight || false}
          onChange={(e) =>
            actions.setProp((draft: typeof props) => {
              draft.enableMinHeight = e.target.checked;
              if (!e.target.checked) {
                draft.minHeight = null;
              } else {
                draft.minHeight = draft.minHeightUnit === "vh" ? 50 : 20;
              }
            })
          }
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
    {props.enableMinHeight && (
      <div className="flex items-center gap-2">
        <input type="range" min={props.minHeightUnit === "vh" ? "10" : "20"} max={props.minHeightUnit === "vh" ? "100" : "1000"} value={props.minHeight || (props.minHeightUnit === "vh" ? 50 : 20)} onChange={(e) => actions.setProp((draft: typeof props) => (draft.minHeight = parseInt(e.target.value, 10)))} className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>px</span>
          <span>vh</span>
        </div>
        <input
          type="number"
          value={props.minHeight || (props.minHeightUnit === "vh" ? 50 : 20)}
          onChange={(e) =>
            actions.setProp((draft: typeof props) => {
              const numeric = parseInt(e.target.value, 10);
              draft.minHeight = Number.isFinite(numeric) ? numeric : draft.minHeightUnit === "vh" ? 50 : 20;
            })
          }
          className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white"
        />
      </div>
    )}
  </div>
);

export const EqualHeightToggle: React.FC<ControlProps> = ({ props, actions }) => (
  <div>
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700">Equal Height</label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={props.equalHeight || false} onChange={(e) => actions.setProp((draft: typeof props) => (draft.equalHeight = e.target.checked))} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
    <p className="text-xs text-gray-500 mt-1">Enabling this will change the Align Items value to Stretch.</p>
  </div>
);

export const HtmlTagSelect: React.FC<ControlProps> = ({ props, actions }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">HTML Tag</label>
    <select value={props.htmlTag || "div"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.htmlTag = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
      <option value="div">div</option>
      <option value="section">section</option>
      <option value="article">article</option>
      <option value="header">header</option>
      <option value="footer">footer</option>
      <option value="main">main</option>
      <option value="aside">aside</option>
      <option value="nav">nav</option>
    </select>
  </div>
);

export const OverflowSelect: React.FC<ControlProps> = ({ props, actions }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Overflow</label>
    <select value={props.overflow || "visible"} onChange={(e) => actions.setProp((draft: typeof props) => (draft.overflow = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
      <option value="visible">Visible</option>
      <option value="hidden">Hidden</option>
      <option value="auto">Auto</option>
      <option value="scroll">Scroll</option>
    </select>
  </div>
);
