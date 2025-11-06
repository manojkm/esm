"use client";

import { useNode } from "@craftjs/core";
import { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";

export const Text = ({ text = "Click to edit", fontSize = "16" }) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp }
  } = useNode((state) => ({
    selected: state.events.selected
  }));

  const [editable, setEditable] = useState(false);
  const [currentText, setCurrentText] = useState(text);

  // Exit edit mode when component is deselected
  useEffect(() => {
    if (!selected) {
      setEditable(false);
    }
  }, [selected]);

  // Update local text when prop changes
  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  const handleClick = (e) => {
    if (selected && !editable) {
      e.stopPropagation();
      setEditable(true);
    }
  };

  const handleChange = (e) => {
    setCurrentText(e.target.value);
  };

  const handleBlur = () => {
    setEditable(false);
    setProp((props) => (props.text = currentText));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setCurrentText(text); // Reset to original
      setEditable(false);
    }
  };

  return (
    <div ref={(ref) => connect(drag(ref))} onClick={handleClick} className={`p-2 transition-all duration-200 ${selected ? (editable ? "ring-2 ring-green-500 bg-green-50" : "ring-2 ring-blue-500 cursor-text") : "border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer"}`}>
      <ContentEditable html={currentText} disabled={!editable} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} className={`text-gray-900 outline-none ${editable ? "bg-white px-1 rounded" : ""}`} style={{ fontSize: `${fontSize}px` }} />
      {selected && !editable && <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t-md font-medium z-10">Click to edit</div>}
    </div>
  );
};

// Component rules for better structure
Text.craft = {
  displayName: "Text",
  rules: {
    canDrag: () => true,
    canMoveIn: () => false, // Text components can't contain other components
    canMoveOut: () => true,
  },
};
