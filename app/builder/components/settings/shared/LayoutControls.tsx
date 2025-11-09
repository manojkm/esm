"use client";

import React from "react";
import { useResponsive } from "@/app/builder/contexts/ResponsiveContext";
import type { ContainerProps } from "../../ui/container/types";
import type { ContainerControlActions } from "./types";
import { ResponsiveSelectControl, type ResponsiveSelectOption } from "./controls/ResponsiveSelectControl";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "./styles";

interface LayoutControlsProps {
  props: ContainerProps;
  actions: ContainerControlActions;
  controlId: string;
  isChildContainer: boolean;
}

interface LayoutTypeControlProps {
  controlId: string;
  value: string;
  onChange: (value: string) => void;
}

export const LayoutTypeControl: React.FC<LayoutTypeControlProps> = ({ controlId, value, onChange }: LayoutTypeControlProps) => {
  const baseId = `${controlId}-layout-type`;
  const options = [
    { value: "block", label: "block" },
    { value: "flex", label: "flex" },
  ];

  return (
    <section id={baseId}>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-buttons`}>
        Layout Type
      </label>
      <div id={`${baseId}-buttons`} className="grid grid-cols-2 gap-1">
        {options.map((option) => (
          <button key={option.value} type="button" data-component-id={`${baseId}-${option.value}`} onClick={() => onChange(option.value)} className={`px-3 py-2 text-xs border rounded capitalize ${value === option.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`} aria-pressed={value === option.value}>
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
};

interface DirectionControlProps {
  controlId: string;
  value: string;
  responsiveValue?: any;
  onChange: (value: string) => void;
  onResponsiveChange?: (value: any) => void;
  useResponsive?: boolean;
}

export const DirectionControl: React.FC<DirectionControlProps> = ({ controlId, value, responsiveValue, onChange, onResponsiveChange, useResponsive = false }: DirectionControlProps) => {
  const baseId = `${controlId}-direction`;
  const options: ResponsiveSelectOption[] = [
    { value: "row", label: "Row" },
    { value: "column", label: "Column" },
    { value: "row-reverse", label: "Row Reverse" },
    { value: "column-reverse", label: "Column Reverse" },
  ];

  if (useResponsive && onResponsiveChange) {
    return <ResponsiveSelectControl controlId={`${controlId}-responsive`} label="Direction" value={responsiveValue} onChange={onResponsiveChange} options={options} defaultValue="row" layout="grid" gridCols={2} />;
  }

  return (
    <section id={baseId}>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-buttons`}>
        Direction
      </label>
      <div id={`${baseId}-buttons`} className="grid grid-cols-2 gap-1">
        {options.map((option) => (
          <button key={option.value} type="button" data-component-id={`${baseId}-${option.value}`} onClick={() => onChange(option.value)} className={`px-2 py-2 text-xs border rounded ${value === option.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`} aria-pressed={value === option.value}>
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
};

interface JustifyContentControlProps {
  controlId: string;
  value: string;
  onChange: (value: string) => void;
  responsiveValue?: any;
  onResponsiveChange?: (value: any) => void;
  useResponsive?: boolean;
}

export const JustifyContentControl: React.FC<JustifyContentControlProps> = ({ controlId, value, onChange, responsiveValue, onResponsiveChange, useResponsive }: JustifyContentControlProps) => {
  const baseId = `${controlId}-justify-content`;
  const options = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"];

  const getLabel = (option: string) => {
    if (option === "flex-start") return "Start";
    if (option === "flex-end") return "End";
    return option.replace("-", " ");
  };

  if (useResponsive && onResponsiveChange) {
    return <ResponsiveSelectControl controlId={`${controlId}-responsive`} label="Justify Content" value={responsiveValue} onChange={onResponsiveChange} options={options.map(opt => ({ value: opt, label: getLabel(opt) }))} defaultValue="flex-start" />;
  }

  return (
    <section id={baseId}>
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-select`}>
          Justify Content
        </label>
        <select id={`${baseId}-select`} value={value} onChange={(event) => onChange(event.target.value)} className={INLINE_FIELD_CLASS}>
          {options.map((option) => (
            <option key={option} value={option}>
              {getLabel(option)}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

interface AlignItemsControlProps {
  controlId: string;
  value: string;
  onChange: (value: string) => void;
  responsiveValue?: any;
  onResponsiveChange?: (value: any) => void;
  useResponsive?: boolean;
}

export const AlignItemsControl: React.FC<AlignItemsControlProps> = ({ controlId, value, onChange, responsiveValue, onResponsiveChange, useResponsive }: AlignItemsControlProps) => {
  const baseId = `${controlId}-align-items`;
  const options = ["stretch", "flex-start", "center", "flex-end", "baseline"];

  const getLabel = (option: string) => {
    if (option === "flex-start") return "Start";
    if (option === "flex-end") return "End";
    return option.replace("-", " ");
  };

  if (useResponsive && onResponsiveChange) {
    return <ResponsiveSelectControl controlId={`${controlId}-responsive`} label="Align Items" value={responsiveValue} onChange={onResponsiveChange} options={options.map(opt => ({ value: opt, label: getLabel(opt) }))} defaultValue="stretch" />;
  }

  return (
    <section id={baseId}>
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-select`}>
          Align Items
        </label>
        <select id={`${baseId}-select`} value={value} onChange={(event) => onChange(event.target.value)} className={INLINE_FIELD_CLASS}>
          {options.map((option) => (
            <option key={option} value={option}>
              {getLabel(option)}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

interface WrapControlProps {
  controlId: string;
  value: string;
  onChange: (value: string) => void;
  responsiveValue?: any;
  onResponsiveChange?: (value: any) => void;
  useResponsive?: boolean;
}

export const WrapControl: React.FC<WrapControlProps> = ({ controlId, value, onChange, responsiveValue, onResponsiveChange, useResponsive }: WrapControlProps) => {
  const baseId = `${controlId}-wrap`;
  const options = [
    { value: "nowrap", label: "No Wrap" },
    { value: "wrap", label: "Wrap" },
    { value: "wrap-reverse", label: "Wrap Reverse" },
  ];

  if (useResponsive && onResponsiveChange) {
    return <ResponsiveSelectControl controlId={`${controlId}-responsive`} label="Wrap" value={responsiveValue} onChange={onResponsiveChange} options={options} defaultValue="nowrap" layout="grid" gridCols={3} />;
  }

  return (
    <section id={baseId}>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-buttons`}>
        Wrap
      </label>
      <div id={`${baseId}-buttons`} className="grid grid-cols-3 gap-1">
        {options.map((option) => (
          <button key={option.value} type="button" data-component-id={`${baseId}-${option.value}`} onClick={() => onChange(option.value)} className={`px-2 py-2 text-xs border rounded ${value === option.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`} aria-pressed={value === option.value}>
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
};

interface LayoutControlsComponentProps {
  controlId: string;
  props: ContainerProps;
  actions: ContainerControlActions;
  isChildContainer: boolean;
}

export const LayoutControls: React.FC<LayoutControlsComponentProps> = ({ controlId, props, actions, isChildContainer }) => {
  const baseId = `layout-controls-${controlId}`;
  const layoutValue = props.layout || (isChildContainer ? "flex" : "block");

  const handleLayoutChange = (value: string) => {
    actions.setProp((draft) => {
      draft.layout = value;
    });
  };

  const handleDirectionChange = (value: string) => {
    actions.setProp((draft) => {
      draft.flexDirection = value;
    });
  };

  const handleDirectionResponsiveChange = (value: any) => {
    actions.setProp((draft) => {
      draft.flexDirectionResponsive = value;
    });
  };

  const handleJustifyContentChange = (value: string) => {
    actions.setProp((draft) => {
      draft.justifyContent = value;
    });
  };

  const handleJustifyContentResponsiveChange = (value: any) => {
    actions.setProp((draft) => {
      draft.justifyContentResponsive = value;
    });
  };

  const handleAlignItemsChange = (value: string) => {
    actions.setProp((draft) => {
      draft.alignItems = value;
    });
  };

  const handleAlignItemsResponsiveChange = (value: any) => {
    actions.setProp((draft) => {
      draft.alignItemsResponsive = value;
    });
  };

  const handleWrapChange = (value: string) => {
    actions.setProp((draft) => {
      draft.flexWrap = value;
    });
  };

  const handleWrapResponsiveChange = (value: any) => {
    actions.setProp((draft) => {
      draft.flexWrapResponsive = value;
    });
  };

  // Get the current value, preferring responsive if available
  const getFlexDirectionValue = () => {
    if (props.flexDirectionResponsive) {
      const { getResponsiveValue } = useResponsive();
      return getResponsiveValue(props.flexDirectionResponsive, isChildContainer ? "column" : "row");
    }
    return props.flexDirection || (isChildContainer ? "column" : "row");
  };

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <LayoutTypeControl controlId={`${controlId}-type`} value={layoutValue} onChange={handleLayoutChange} />
      {layoutValue === "flex" && (
        <div className="space-y-4">
          <DirectionControl 
            controlId={`${controlId}-direction`} 
            value={getFlexDirectionValue()} 
            responsiveValue={props.flexDirectionResponsive}
            onChange={handleDirectionChange}
            onResponsiveChange={handleDirectionResponsiveChange}
            useResponsive={true}
          />
          <JustifyContentControl 
            controlId={`${controlId}-justify`} 
            value={props.justifyContent || (isChildContainer ? "center" : "flex-start")} 
            responsiveValue={props.justifyContentResponsive}
            onChange={handleJustifyContentChange}
            onResponsiveChange={handleJustifyContentResponsiveChange}
            useResponsive={true}
          />
          <AlignItemsControl 
            controlId={`${controlId}-align`} 
            value={props.alignItems || (isChildContainer ? "center" : "stretch")} 
            responsiveValue={props.alignItemsResponsive}
            onChange={handleAlignItemsChange}
            onResponsiveChange={handleAlignItemsResponsiveChange}
            useResponsive={true}
          />
          <WrapControl 
            controlId={`${controlId}-wrap`} 
            value={props.flexWrap || "nowrap"} 
            responsiveValue={props.flexWrapResponsive}
            onChange={handleWrapChange}
            onResponsiveChange={handleWrapResponsiveChange}
            useResponsive={true}
          />
        </div>
      )}
    </div>
  );
};
