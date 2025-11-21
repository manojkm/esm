import React from "react";
import type { ResolvedSeparator } from "./headingStyleHelpers";

interface SeparatorProps {
  style: string;
  resolvedSeparator: ResolvedSeparator;
  isEditMode: boolean;
}

export const Separator: React.FC<SeparatorProps> = ({ style, resolvedSeparator, isEditMode }) => {
  if (style === "none") {
    return null;
  }

  const borderStyle = style === "double" ? "double" : style === "dashed" ? "dashed" : style === "dotted" ? "dotted" : "solid";

  const separatorStyleCss: React.CSSProperties = {
    width: isEditMode ? resolvedSeparator.width : undefined,
    borderTopStyle: isEditMode ? borderStyle : undefined,
    borderTopWidth: isEditMode ? `${resolvedSeparator.thickness}px` : undefined,
    borderTopColor: isEditMode ? resolvedSeparator.color : undefined,
    borderBottom: isEditMode ? "none" : undefined,
    borderLeft: isEditMode ? "none" : undefined,
    borderRight: isEditMode ? "none" : undefined,
    marginBottom: isEditMode ? resolvedSeparator.bottomSpacing : undefined,
    height: isEditMode ? 0 : undefined,
    display: isEditMode ? "inline-block" : undefined,
  };

  return <div className="heading-separator" style={separatorStyleCss} />;
};

