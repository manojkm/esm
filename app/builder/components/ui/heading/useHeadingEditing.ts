import { useState, useEffect } from "react";
import { useNode } from "@craftjs/core";
import type { HeadingProps } from "./types";

/**
 * Custom hook for managing Heading component editing state
 */
export function useHeadingEditing(props: HeadingProps) {
  const { text, subHeading } = props;
  const { selected, actions } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const [editableHeading, setEditableHeading] = useState(false);
  const [editableSubHeading, setEditableSubHeading] = useState(false);
  const [currentHeadingText, setCurrentHeadingText] = useState(text || "");
  const [currentSubHeadingText, setCurrentSubHeadingText] = useState(subHeading || "");

  // Reset editing state when component is deselected
  useEffect(() => {
    if (!selected) {
      setEditableHeading(false);
      setEditableSubHeading(false);
    }
  }, [selected]);

  // Sync state with props
  useEffect(() => {
    setCurrentHeadingText(text || "");
  }, [text]);

  useEffect(() => {
    setCurrentSubHeadingText(subHeading || "");
  }, [subHeading]);

  const handleHeadingChange = (newText: string) => {
    setCurrentHeadingText(newText);
    actions.setProp((props: HeadingProps) => {
      props.text = newText;
    });
  };

  const handleSubHeadingChange = (newText: string) => {
    setCurrentSubHeadingText(newText);
    actions.setProp((props: HeadingProps) => {
      props.subHeading = newText;
    });
  };

  return {
    editableHeading,
    editableSubHeading,
    currentHeadingText,
    currentSubHeadingText,
    setEditableHeading,
    setEditableSubHeading,
    handleHeadingChange,
    handleSubHeadingChange,
    selected: selected || false,
  };
}

