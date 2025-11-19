"use client";

import React, { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $createParagraphNode } from "lexical";
import { FloatingToolbarPlugin } from "./LexicalToolbar";

interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  style?: React.CSSProperties;
  readOnly?: boolean;
}

// Custom plugin to handle HTML serialization
function OnChangeHTMLPlugin({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        let htmlString = $generateHtmlFromNodes(editor, null);
        
        // Clean up Lexical-specific classes and attributes for cleaner HTML
        htmlString = htmlString.replace(/\s*class="editor-[^"]*"/gi, "");
        htmlString = htmlString.replace(/\s*class=""/gi, "");
        htmlString = htmlString.replace(/\s*style="white-space:\s*pre-wrap;?"/gi, "");
        htmlString = htmlString.replace(/\s*style=""/gi, "");
        
        // Remove redundant formatting tags: <b><strong> -> <strong>, <i><em> -> <em>
        htmlString = htmlString.replace(/<b[^>]*>(<strong[^>]*>.*?<\/strong>)<\/b>/gi, "$1");
        htmlString = htmlString.replace(/<strong[^>]*>(<b[^>]*>.*?<\/b>)<\/strong>/gi, "$1");
        htmlString = htmlString.replace(/<i[^>]*>(<em[^>]*>.*?<\/em>)<\/i>/gi, "$1");
        htmlString = htmlString.replace(/<em[^>]*>(<i[^>]*>.*?<\/i>)<\/em>/gi, "$1");
        
        // Remove empty spans
        htmlString = htmlString.replace(/<span[^>]*>\s*<\/span>/gi, "");
        
        onChange(htmlString);
      });
    });
  }, [editor, onChange]);

  return null;
}

// Plugin to initialize HTML content (only runs once on mount)
function InitialHTMLPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Only initialize once on mount if we have HTML and editor is empty
    if (html && !isInitializedRef.current) {
      editor.update(() => {
        const root = $getRoot();
        const isEmpty = root.getChildrenSize() === 0 || 
          (root.getChildrenSize() === 1 && 
           root.getFirstChild()?.getTextContent().trim() === "");
        
        // Only initialize if editor is empty
        if (isEmpty) {
          const parser = new DOMParser();
          const dom = parser.parseFromString(html, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          root.clear();
          
          // Ensure we have at least one paragraph node
          // If nodes is empty, create an empty paragraph
          if (nodes.length === 0) {
            root.append($createParagraphNode());
          } else {
            // $generateNodesFromDOM should return proper element nodes, but we'll be safe
            // and ensure all nodes are valid for root (element or decorator nodes only)
            try {
              root.append(...nodes);
            } catch (error) {
              // If appending fails (e.g., contains text nodes), wrap in paragraph
              const paragraph = $createParagraphNode();
              paragraph.append(...nodes);
              root.append(paragraph);
            }
          }
        }
        isInitializedRef.current = true;
      }, { discrete: true });
    }
  }, [editor, html]);

  return null;
}

const theme = {
  paragraph: "editor-paragraph",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listItem",
  },
  link: "editor-link",
  text: {
    bold: "editor-textBold",
    italic: "editor-textItalic",
    strikethrough: "editor-textStrikethrough",
    underline: "editor-textUnderline",
  },
};

export const LexicalEditor: React.FC<LexicalEditorProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = "Type your text here",
  style,
  readOnly = false,
}) => {
  const initialConfig = {
    namespace: "TextEditor",
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode],
    editable: !readOnly,
  };

  return (
    <div className="lexical-editor-wrapper" style={{ position: "relative", ...style }}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container" style={{ position: "relative" }}>
          <div className="editor-inner text-content" style={{ position: "relative" }}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input"
                  style={{
                    outline: "none",
                    minHeight: "20px",
                  }}
                  onBlur={onBlur}
                />
              }
              placeholder={
                <div className="editor-placeholder" style={{ color: "#9ca3af" }}>
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <LinkPlugin />
            <ListPlugin />
            <FloatingToolbarPlugin />
            <OnChangeHTMLPlugin onChange={onChange} />
            {value && <InitialHTMLPlugin html={value} />}
          </div>
        </div>
      </LexicalComposer>
      <style>{`
        .lexical-editor-wrapper {
          position: relative;
        }
        .editor-container {
          position: relative;
        }
        .editor-inner {
          position: relative;
        }
        .editor-input {
          outline: none;
        }
        .editor-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          color: #9ca3af;
          pointer-events: none;
          user-select: none;
        }
        .editor-textBold {
          font-weight: bold;
        }
        .editor-textItalic {
          font-style: italic;
        }
        .editor-textUnderline {
          text-decoration: underline;
        }
        .editor-textStrikethrough {
          text-decoration: line-through;
        }
        .editor-heading-h1 {
          font-size: 2em;
          font-weight: bold;
        }
        .editor-heading-h2 {
          font-size: 1.5em;
          font-weight: bold;
        }
        .editor-heading-h3 {
          font-size: 1.17em;
          font-weight: bold;
        }
        .editor-heading-h4 {
          font-size: 1em;
          font-weight: bold;
        }
        .editor-heading-h5 {
          font-size: 0.83em;
          font-weight: bold;
        }
        .editor-heading-h6 {
          font-size: 0.67em;
          font-weight: bold;
        }
        .editor-list-ol {
          list-style-type: decimal;
          padding-left: 1.5em;
        }
        .editor-list-ul {
          list-style-type: disc;
          padding-left: 1.5em;
        }
        .editor-listItem {
          margin: 0.25em 0;
        }
        .editor-link {
          color: #0066cc;
          text-decoration: underline;
          cursor: pointer;
        }
        .editor-link:hover {
          color: #004499;
        }
      `}</style>
    </div>
  );
};
