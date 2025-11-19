"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, $isListNode } from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { $isQuoteNode, $createQuoteNode } from "@lexical/rich-text";

interface FloatingToolbarProps {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ editor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [isQuote, setIsQuote] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Check if selection is collapsed (no text selected) or empty
        const isCollapsed = selection.isCollapsed();
        const selectedText = selection.getTextContent();
        const hasSelectedText = selectedText.trim().length > 0;
        
        // Only show toolbar if there's actual selected text (not collapsed and not empty)
        if (isCollapsed || !hasSelectedText) {
          setIsVisible(false);
          return;
        }

        // Update format states
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));

        // Update link state
        const node = selection.anchor.getNode();
        const parent = node.getKey() !== "root" ? $findMatchingParent(node, (n) => $isLinkNode(n)) : null;
        setIsLink(parent !== null);

        // Update block type and list/quote states
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();
        
        // Check for lists
        const listParent = $findMatchingParent(anchorNode, (n) => $isListNode(n));
        if (listParent) {
          const listType = listParent.getListType();
          setIsBulletList(listType === "bullet");
          setIsNumberedList(listType === "number");
        } else {
          setIsBulletList(false);
          setIsNumberedList(false);
        }
        
        // Check for quote
        setIsQuote($isQuoteNode(element));
      } else {
        setIsVisible(false);
        return;
      }
    });

    // Update position (outside of read context)
    const nativeSelection = window.getSelection();
    if (nativeSelection !== null && nativeSelection.rangeCount > 0) {
      const range = nativeSelection.getRangeAt(0);
      // Check if native selection is collapsed or empty
      const isNativeCollapsed = range.collapsed;
      const nativeSelectedText = range.toString().trim();
      
      // Only show toolbar if there's actual selected text
      if (isNativeCollapsed || nativeSelectedText.length === 0) {
        setIsVisible(false);
        return;
      }
      
      const rect = range.getBoundingClientRect();
      const toolbarHeight = toolbarRef.current?.offsetHeight || 40;
      const toolbarWidth = toolbarRef.current?.offsetWidth || 400;
      
      // Calculate position: center toolbar above selection
      let left = rect.left + (rect.width / 2) - (toolbarWidth / 2);
      let top = rect.top - toolbarHeight - 8;
      
      // Keep toolbar within viewport
      if (left < 8) left = 8;
      if (left + toolbarWidth > window.innerWidth - 8) {
        left = window.innerWidth - toolbarWidth - 8;
      }
      if (top < 8) {
        // Show toolbar below selection if there's no space above
        top = rect.bottom + 8;
      }
      
      setPosition({ top, left });
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (!isInteractingRef.current) {
          updateToolbar();
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          if (!isInteractingRef.current) {
            updateToolbar();
          }
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, updateToolbar]);

  // Hide toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.toString().trim() === "") {
          setIsVisible(false);
        }
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isVisible]);

  const formatText = useCallback(
    (format: "bold" | "italic" | "underline" | "strikethrough") => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor]
  );

  const formatList = useCallback(
    (listType: "bullet" | "number") => {
      if (listType === "bullet") {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    },
    [editor]
  );

  const removeList = useCallback(() => {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }, [editor]);

  const formatQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();
        
        if ($isQuoteNode(element)) {
          // Convert quote back to paragraph
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          // Convert to quote
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
  }, [editor]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      const url = prompt("Enter URL:");
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isInteractingRef.current = true;
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      isInteractingRef.current = false;
      updateToolbar();
    }, 100);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className="lexical-floating-toolbar"
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 8px",
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        color: "#1f2937", // Explicit color to prevent inheritance from parent Text component
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Bold */}
      <button
        type="button"
        onClick={() => formatText("bold")}
        onMouseDown={handleMouseDown}
        className={`lexical-toolbar-button ${isBold ? "active" : ""}`}
        style={{
          padding: "6px 10px",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          backgroundColor: isBold ? "#e5e7eb" : "#fff",
          color: "#1f2937", // Explicit color to prevent inheritance
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          outline: "none",
        }}
        title="Bold"
      >
        B
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => formatText("italic")}
        onMouseDown={handleMouseDown}
        className={`lexical-toolbar-button ${isItalic ? "active" : ""}`}
        style={{
          padding: "6px 10px",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          backgroundColor: isItalic ? "#e5e7eb" : "#fff",
          color: "#1f2937", // Explicit color to prevent inheritance
          cursor: "pointer",
          fontStyle: "italic",
          fontSize: "14px",
          outline: "none",
        }}
        title="Italic"
      >
        I
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={() => formatText("underline")}
        onMouseDown={handleMouseDown}
        className={`lexical-toolbar-button ${isUnderline ? "active" : ""}`}
        style={{
          padding: "6px 10px",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          backgroundColor: isUnderline ? "#e5e7eb" : "#fff",
          color: "#1f2937", // Explicit color to prevent inheritance
          cursor: "pointer",
          textDecoration: "underline",
          fontSize: "14px",
          outline: "none",
        }}
        title="Underline"
      >
        U
      </button>

      {/* Strikethrough */}
      <button
        type="button"
        onClick={() => formatText("strikethrough")}
        onMouseDown={handleMouseDown}
        className={`lexical-toolbar-button ${isStrikethrough ? "active" : ""}`}
        style={{
          padding: "6px 10px",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          backgroundColor: isStrikethrough ? "#e5e7eb" : "#fff",
          color: "#1f2937", // Explicit color to prevent inheritance
          cursor: "pointer",
          textDecoration: "line-through",
          fontSize: "14px",
          outline: "none",
        }}
        title="Strikethrough"
      >
        S
      </button>

      {/* Separator */}
      <div style={{ width: "1px", height: "20px", backgroundColor: "#e5e7eb", margin: "0 4px" }} />

      {/* Link */}
      <button
        type="button"
        onClick={insertLink}
        onMouseDown={handleMouseDown}
        className={`lexical-toolbar-button ${isLink ? "active" : ""}`}
        style={{
          padding: "6px 10px",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          backgroundColor: isLink ? "#e5e7eb" : "#fff",
          color: "#1f2937", // Explicit color to prevent inheritance
          cursor: "pointer",
          fontSize: "14px",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Insert Link"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.87991 11.5807C7.15324 11.854 7.51324 12 7.88657 12C8.25991 12 8.61991 11.854 8.89324 11.5807L11.5806 8.89333C11.854 8.62 12 8.26 12 7.88667C12 7.51333 11.854 7.15333 11.5806 6.88L9.88657 5.18667C9.61324 4.91333 9.25324 4.76667 8.87991 4.76667C8.50657 4.76667 8.14657 4.91333 7.87324 5.18667L6.17991 6.88C5.90657 7.15333 5.75991 7.51333 5.75991 7.88667C5.75991 8.26 5.90657 8.62 6.17991 8.89333L6.87991 11.5807Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.12009 4.41933C8.84676 4.146 8.48676 4 8.11343 4C7.74009 4 7.38009 4.146 7.10676 4.41933L4.41943 7.10667C4.14609 7.38 4 7.74 4 8.11333C4 8.48667 4.14609 8.84667 4.41943 9.12L6.11343 10.8133C6.38676 11.0867 6.74676 11.2333 7.12009 11.2333C7.49343 11.2333 7.85343 11.0867 8.12676 10.8133L9.82009 9.12C10.0934 8.84667 10.2401 8.48667 10.2401 8.11333C10.2401 7.74 10.0934 7.38 9.82009 7.10667L9.12009 4.41933Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Separator */}
      <div style={{ width: "1px", height: "20px", backgroundColor: "#e5e7eb", margin: "0 4px" }} />

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => isBulletList ? removeList() : formatList("bullet")}
        onMouseDown={handleMouseDown}
        className={`lexical-toolbar-button ${isBulletList ? "active" : ""}`}
        style={{
          padding: "6px 8px",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          backgroundColor: isBulletList ? "#e5e7eb" : "#fff",
          color: "#1f2937", // Explicit color to prevent inheritance
          cursor: "pointer",
          fontSize: "14px",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Bullet List"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="4" r="1.5" fill="currentColor" />
          <circle cx="3" cy="8" r="1.5" fill="currentColor" />
          <circle cx="3" cy="12" r="1.5" fill="currentColor" />
          <path d="M6 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Numbered List */}
      <button
        type="button"
        onClick={() => isNumberedList ? removeList() : formatList("number")}
        onMouseDown={handleMouseDown}
        className={`lexical-toolbar-button ${isNumberedList ? "active" : ""}`}
        style={{
          padding: "6px 8px",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          backgroundColor: isNumberedList ? "#e5e7eb" : "#fff",
          color: "#1f2937", // Explicit color to prevent inheritance
          cursor: "pointer",
          fontSize: "14px",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Numbered List"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 2V4H4V2H3Z" fill="currentColor" />
          <path d="M3 6V8H4V6H3Z" fill="currentColor" />
          <path d="M3 10V12H4V10H3Z" fill="currentColor" />
          <path d="M6 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Quote */}
      <button
        type="button"
        onClick={formatQuote}
        onMouseDown={handleMouseDown}
        className={`lexical-toolbar-button ${isQuote ? "active" : ""}`}
        style={{
          padding: "6px 8px",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          backgroundColor: isQuote ? "#e5e7eb" : "#fff",
          color: "#1f2937", // Explicit color to prevent inheritance
          cursor: "pointer",
          fontSize: "14px",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Quote"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4C3 5.5 4 6.5 5.5 7.5C6 7.8 6.5 8 7 8C7.5 8 8 7.5 8 7V4C8 3.5 7.5 3 7 3H4C3.5 3 3 3.5 3 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 4C8 5.5 9 6.5 10.5 7.5C11 7.8 11.5 8 12 8C12.5 8 13 7.5 13 7V4C13 3.5 12.5 3 12 3H9C8.5 3 8 3.5 8 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

    </div>
  );
};

export const FloatingToolbarPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  return <FloatingToolbar editor={editor} />;
};

