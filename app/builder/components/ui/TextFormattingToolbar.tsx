"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bold, Italic, Underline, Strikethrough, Link, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

interface TextFormattingToolbarProps {
  onFormat: (command: string, value?: string) => void;
  position: { top: number; left: number };
  onClose?: () => void;
}

export const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({ onFormat, position, onClose }) => {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        // Don't close if clicking on the toolbar itself
        return;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFormat = (command: string, value?: string) => {
    try {
      document.execCommand(command, false, value);
      onFormat(command, value);
    } catch (error) {
      console.error("Format command failed:", error);
    }
  };

  const toolbarContent = (
    <div
      ref={toolbarRef}
      className="fixed z-[9999] bg-white border border-gray-300 rounded-lg shadow-lg p-1 flex items-center gap-1"
      style={{
        top: `${Math.max(0, position.top)}px`,
        left: `${Math.max(0, position.left)}px`,
        transform: "translateX(-50%)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFormat("bold");
        }}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Bold (Ctrl+B)"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFormat("italic");
        }}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Italic (Ctrl+I)"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Italic size={16} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFormat("underline");
        }}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Underline (Ctrl+U)"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Underline size={16} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFormat("strikeThrough");
        }}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Strikethrough"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Strikethrough size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const url = prompt("Enter URL:");
          if (url) handleFormat("createLink", url);
        }}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Insert Link"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Link size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFormat("justifyLeft");
        }}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Align Left"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFormat("justifyCenter");
        }}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Align Center"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFormat("justifyRight");
        }}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Align Right"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
      >
        <AlignRight size={16} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFormat("justifyFull");
        }}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Justify"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
      >
        <AlignJustify size={16} />
      </button>
    </div>
  );

  // Use portal to render toolbar at document body level to avoid z-index issues
  if (typeof window !== "undefined") {
    return createPortal(toolbarContent, document.body);
  }

  return toolbarContent;
};

