import React from "react";
import ContentEditable from "react-contenteditable";
import { sanitizeHTML } from "@/app/builder/lib/html-sanitizer";
import type { ResolvedHeadingTypography } from "./headingStyleHelpers";

interface HeadingContentProps {
  tag: string;
  text: string;
  isEmpty: boolean;
  isEditMode: boolean;
  isEditing: boolean;
  style: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onChange: (e: React.FormEvent<HTMLDivElement>) => void;
  onBlur: () => void;
}

export const HeadingContent: React.FC<HeadingContentProps> = ({
  tag,
  text,
  isEmpty,
  isEditMode,
  isEditing,
  style,
  onClick,
  onChange,
  onBlur,
}) => {
  const HeadingTag = tag;

  if (isEditing && isEditMode) {
    return (
      <div style={{ position: "relative", width: "100%", minHeight: "1em" }}>
        <ContentEditable
          html={text || ""}
          onChange={onChange}
          onBlur={onBlur}
          tagName={HeadingTag}
          className="heading-text"
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
            Write a Heading
          </span>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return React.createElement(
      HeadingTag,
      {
        className: "heading-text",
        style: {
          ...style,
          color: "#9ca3af", // Override with placeholder color only for placeholder
        },
        onClick: isEditMode ? onClick : undefined,
      },
      React.createElement(
        "span",
        {
          className: "pointer-events-none select-none",
          style: { color: "#9ca3af" },
        },
        "Write a Heading"
      )
    );
  }

  return React.createElement(HeadingTag, {
    className: "heading-text",
    style,
    onClick: isEditMode ? onClick : undefined,
    dangerouslySetInnerHTML: { __html: sanitizeHTML(text) },
  });
};

