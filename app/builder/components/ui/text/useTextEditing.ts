import { useState, useEffect } from "react";
import type { TextProps } from "./types";

interface UseTextEditingReturn {
  editable: boolean;
  currentText: string;
  handleClick: (e: React.MouseEvent) => void;
  handleChange: (value: string) => void;
  handleBlur: () => void;
  isEmpty: boolean;
}

/**
 * Custom hook for managing Text component editing state
 */
export function useTextEditing(
  props: TextProps,
  selected: boolean,
  isEditMode: boolean,
  setProp: (callback: (props: TextProps) => void) => void
): UseTextEditingReturn {
  const [editable, setEditable] = useState(false);
  const [currentText, setCurrentText] = useState(props.text || "");

  // Reset editing state when component is deselected
  useEffect(() => {
    if (!selected) {
      setEditable(false);
    }
  }, [selected]);

  // Sync local state with props
  useEffect(() => {
    setCurrentText(props.text || "");
  }, [props.text]);

  const handleClick = (e: React.MouseEvent) => {
    if (selected && !editable && isEditMode) {
      e.stopPropagation();
      setEditable(true);
    }
  };

  const handleChange = (value: string) => {
    setCurrentText(value);
    // Update the prop immediately for real-time updates
    setProp((props: TextProps) => {
      props.text = value;
    });
  };

  const handleBlur = () => {
    setEditable(false);
  };

  // Check if text is empty for placeholder
  const isEmpty =
    !currentText ||
    currentText.trim() === "" ||
    currentText === "<p><br></p>" ||
    currentText === "<p></p>" ||
    currentText.replace(/<[^>]*>/g, "").trim() === "";

  return {
    editable,
    currentText,
    handleClick,
    handleChange,
    handleBlur,
    isEmpty,
  };
}

