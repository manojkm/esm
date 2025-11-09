"use client";

import React from "react";
import type { ContainerProps } from "../../ui/container/types";
import type { ContainerControlActions } from "./types";
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
  onChange: (value: string) => void;
}

export const DirectionControl: React.FC<DirectionControlProps> = ({ controlId, value, onChange }: DirectionControlProps) => {
  const baseId = `${controlId}-direction`;
  const options = [
    { value: "row", label: "Row" },
    { value: "column", label: "Column" },
    { value: "row-reverse", label: "Row Reverse" },
    { value: "column-reverse", label: "Column Reverse" },
  ];

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
}

export const JustifyContentControl: React.FC<JustifyContentControlProps> = ({ controlId, value, onChange }: JustifyContentControlProps) => {
  const baseId = `${controlId}-justify-content`;
  const options = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"];

  const getLabel = (option: string) => {
    if (option === "flex-start") return "Start";
    if (option === "flex-end") return "End";
    return option.replace("-", " ");
  };

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
}

export const AlignItemsControl: React.FC<AlignItemsControlProps> = ({ controlId, value, onChange }: AlignItemsControlProps) => {
  const baseId = `${controlId}-align-items`;
  const options = ["stretch", "flex-start", "center", "flex-end", "baseline"];

  const getLabel = (option: string) => {
    if (option === "flex-start") return "Start";
    if (option === "flex-end") return "End";
    return option.replace("-", " ");
  };

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
}

export const WrapControl: React.FC<WrapControlProps> = ({ controlId, value, onChange }: WrapControlProps) => {
  const baseId = `${controlId}-wrap`;
  const options = [
    { value: "nowrap", label: "No Wrap" },
    { value: "wrap", label: "Wrap" },
    { value: "wrap-reverse", label: "Wrap Reverse" },
  ];

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

  const handleJustifyContentChange = (value: string) => {
    actions.setProp((draft) => {
      draft.justifyContent = value;
    });
  };

  const handleAlignItemsChange = (value: string) => {
    actions.setProp((draft) => {
      draft.alignItems = value;
    });
  };

  const handleWrapChange = (value: string) => {
    actions.setProp((draft) => {
      draft.flexWrap = value;
    });
  };

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <LayoutTypeControl controlId={`${controlId}-type`} value={layoutValue} onChange={handleLayoutChange} />
      {layoutValue === "flex" && (
        <div className="space-y-4">
          <DirectionControl controlId={`${controlId}-direction`} value={props.flexDirection || (isChildContainer ? "column" : "row")} onChange={handleDirectionChange} />
          <JustifyContentControl controlId={`${controlId}-justify`} value={props.justifyContent || (isChildContainer ? "center" : "flex-start")} onChange={handleJustifyContentChange} />
          <AlignItemsControl controlId={`${controlId}-align`} value={props.alignItems || (isChildContainer ? "center" : "stretch")} onChange={handleAlignItemsChange} />
          <WrapControl controlId={`${controlId}-wrap`} value={props.flexWrap || "nowrap"} onChange={handleWrapChange} />
        </div>
      )}
    </div>
  );
};

