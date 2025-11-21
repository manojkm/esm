import React from "react";
import ContentEditable from "react-contenteditable";
import { sanitizeHTML } from "@/app/builder/lib/html-sanitizer";
import type { ResolvedSubHeadingTypography } from "./headingStyleHelpers";

interface SubHeadingContentProps {
  text: string;
  isEmpty: boolean;
  isEditMode: boolean;
  isEditing: boolean;
  style: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onChange: (e: React.FormEvent<HTMLDivElement>) => void;
  onBlur: () => void;
}

export const SubHeadingContent: React.FC<SubHeadingContentProps> = ({
  text,
  isEmpty,
  isEditMode,
  isEditing,
  style,
  onClick,
  onChange,
  onBlur,
}) => {
  if (isEditing && isEditMode) {
    return (
      <div style={{ position: "relative", width: "100%", minHeight: "1em" }}>
        <ContentEditable
          html={text || ""}
          onChange={onChange}
          onBlur={onBlur}
          tagName="p"
          className="sub-heading-text"
          style={{ ...style, border: "none", outline: "none", background: "transparent", width: "100%", minHeight: "1em" }}
        />
        {isEmpty && (
          <span
            className="pointer-events-none select-none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              ...style,
              color: "#9ca3af",
            }}
          >
            Write a Sub Heading
          </span>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <p className="sub-heading-text" style={{ ...style, color: "#9ca3af" }} onClick={isEditMode ? onClick : undefined}>
        <span className="pointer-events-none select-none" style={{ color: "#9ca3af" }}>
          Write a Sub Heading
        </span>
      </p>
    );
  }

  return (
    <p className="sub-heading-text" style={style} onClick={isEditMode ? onClick : undefined} dangerouslySetInnerHTML={{ __html: sanitizeHTML(text) }} />
  );
};

