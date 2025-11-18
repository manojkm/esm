"use client";

import React, { useRef, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, $addUpdateTag, SKIP_DOM_SELECTION_TAG, $createRangeSelection, $setSelection, RangeSelection } from "lexical";
import { $getNodeByKey } from "lexical";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode } from "lexical";
import { Bold, Italic, Underline, Strikethrough, Link, List, ListOrdered } from "lucide-react";

export const LexicalToolbar: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInteractingRef = useRef(false);
  const savedSelectionDataRef = useRef<{
    anchorKey: string;
    anchorOffset: number;
    focusKey: string;
    focusOffset: number;
  } | null>(null);

  const updateToolbar = React.useCallback(() => {
    // Don't update if user is interacting with toolbar
    if (isInteractingRef.current) {
      return;
    }

    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    const selection = $getSelection();
    if ($isRangeSelection(selection) && !selection.isCollapsed()) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      
      // Save selection data for later restoration (not the selection object itself)
      savedSelectionDataRef.current = {
        anchorKey: selection.anchor.key,
        anchorOffset: selection.anchor.offset,
        focusKey: selection.focus.key,
        focusOffset: selection.focus.offset,
      };
      
      // Get selection position
      const nativeSelection = window.getSelection();
      if (nativeSelection && nativeSelection.rangeCount > 0) {
        const range = nativeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorElement = editor.getRootElement();
        
        if (editorElement) {
          const editorRect = editorElement.getBoundingClientRect();
          const toolbarHeight = toolbarRef.current?.offsetHeight || 40;
          
          setPosition({
            top: rect.top - editorRect.top - toolbarHeight - 8,
            left: rect.left - editorRect.left + (rect.width / 2) - (toolbarRef.current?.offsetWidth || 200) / 2,
          });
          
          setIsVisible(true);
        }
      }
    } else {
      // Only hide if not interacting with toolbar
      if (!isInteractingRef.current) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 200);
      }
    }
  }, [editor]);

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  // Also listen to selection changes
  React.useEffect(() => {
    const handleSelectionChange = () => {
      // Don't update if user is interacting with toolbar
      if (isInteractingRef.current) {
        return;
      }
      editor.getEditorState().read(() => {
        updateToolbar();
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [editor, updateToolbar]);

  // Prevent toolbar from hiding when clicking on it
  const handleToolbarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isInteractingRef.current = true;
    
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleToolbarMouseUp = () => {
    // Small delay before allowing toolbar to hide again
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 100);
  };

  // Helper to restore selection within an editor.update() callback
  const restoreSelectionInUpdate = () => {
    if (savedSelectionDataRef.current) {
      const { anchorKey, anchorOffset, focusKey, focusOffset } = savedSelectionDataRef.current;
      
      try {
        const anchorNode = $getNodeByKey(anchorKey);
        const focusNode = $getNodeByKey(focusKey);
        
        if (anchorNode && focusNode) {
          const newSelection = $createRangeSelection();
          newSelection.anchor.set(anchorKey, anchorOffset, 'text');
          newSelection.focus.set(focusKey, focusOffset, 'text');
          $setSelection(newSelection);
          return true;
        }
      } catch (error) {
        // If nodes don't exist anymore, selection can't be restored
        console.warn("Could not restore selection:", error);
      }
    }
    return false;
  };

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough") => {
    isInteractingRef.current = true;
    
    editor.update(() => {
      $addUpdateTag(SKIP_DOM_SELECTION_TAG);
      
      // Restore selection if needed
      restoreSelectionInUpdate();
      
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    }, {
      onUpdate: () => {
        // Restore selection after formatting
        setTimeout(() => {
          editor.update(() => {
            restoreSelectionInUpdate();
          }, { discrete: true });
          isInteractingRef.current = false;
        }, 50);
      }
    });
  };

  const formatLink = () => {
    isInteractingRef.current = true;
    
    const url = prompt("Enter URL:");
    if (url) {
      editor.update(() => {
        $addUpdateTag(SKIP_DOM_SELECTION_TAG);
        
        // Restore selection if needed
        restoreSelectionInUpdate();
        
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }, {
        onUpdate: () => {
          setTimeout(() => {
            editor.update(() => {
              restoreSelectionInUpdate();
            }, { discrete: true });
            isInteractingRef.current = false;
          }, 50);
        }
      });
    } else {
      isInteractingRef.current = false;
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    isInteractingRef.current = true;
    
    editor.update(() => {
      $addUpdateTag(SKIP_DOM_SELECTION_TAG);
      
      // Restore selection first
      restoreSelectionInUpdate();
      
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    }, {
      onUpdate: () => {
        setTimeout(() => {
          editor.update(() => {
            restoreSelectionInUpdate();
          }, { discrete: true });
          isInteractingRef.current = false;
        }, 50);
      }
    });
  };

  const formatList = (listType: "bullet" | "number") => {
    isInteractingRef.current = true;
    
    editor.update(() => {
      $addUpdateTag(SKIP_DOM_SELECTION_TAG);
      
      // Restore selection if needed
      restoreSelectionInUpdate();
      
      if (listType === "bullet") {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    }, {
      onUpdate: () => {
        setTimeout(() => {
          editor.update(() => {
            restoreSelectionInUpdate();
          }, { discrete: true });
          isInteractingRef.current = false;
        }, 50);
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 flex items-center gap-1 p-2 bg-white border border-gray-300 rounded-lg shadow-lg"
      style={{
        top: `${position.top}px`,
        left: `${Math.max(0, position.left)}px`,
      }}
      onMouseDown={handleToolbarMouseDown}
      onMouseUp={handleToolbarMouseUp}
      onMouseLeave={handleToolbarMouseUp}
    >
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formatText("bold");
        }}
        className={`p-2 rounded transition-colors ${isBold ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
        title="Bold (Ctrl+B)"
        type="button"
      >
        <Bold size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formatText("italic");
        }}
        className={`p-2 rounded transition-colors ${isItalic ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
        title="Italic (Ctrl+I)"
        type="button"
      >
        <Italic size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formatText("underline");
        }}
        className={`p-2 rounded transition-colors ${isUnderline ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
        title="Underline (Ctrl+U)"
        type="button"
      >
        <Underline size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formatText("strikethrough");
        }}
        className={`p-2 rounded transition-colors ${isStrikethrough ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
        title="Strikethrough"
        type="button"
      >
        <Strikethrough size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formatLink();
        }}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Insert Link"
        type="button"
      >
        <Link size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <select
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const value = e.target.value;
          if (value === "p") {
            editor.update(() => {
              $addUpdateTag(SKIP_DOM_SELECTION_TAG);
              restoreSelectionInUpdate();
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
              }
            });
          } else {
            formatHeading(value as HeadingTagType);
          }
        }}
        className="px-2 py-1 text-xs border border-gray-300 rounded bg-white"
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
      </select>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formatList("bullet");
        }}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Bullet List"
        type="button"
      >
        <List size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formatList("number");
        }}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Numbered List"
        type="button"
      >
        <ListOrdered size={16} />
      </button>
    </div>
  );
};
