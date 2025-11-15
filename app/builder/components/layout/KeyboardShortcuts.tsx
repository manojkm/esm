"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { useKeyboardShortcuts } from "@/app/builder/hooks/useKeyboardShortcuts";
import { X } from "lucide-react";

export const KeyboardShortcuts: React.FC = () => {
  const { selected, actions, query } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    return {
      selected: currentNodeId || null,
    };
  });

  const [showHelp, setShowHelp] = useState(false);

  const handleCopy = () => {
    if (!selected) return;
    const node = query.node(selected).get();
    const parent = node.data.parent;

    if (parent !== null) {
      const buildElementTree = (nodeId: string): React.ReactElement => {
        const currentNode = query.node(nodeId).get();
        const nodeChildren = currentNode.data.nodes || [];
        const childElements = nodeChildren.map((childId: string) => buildElementTree(childId));
        return React.createElement(currentNode.data.type, currentNode.data.props, ...childElements);
      };

      const elementTree = buildElementTree(selected);
      const newNodeTree = query.parseReactElement(elementTree).toNodeTree();
      actions.addNodeTree(newNodeTree, parent);
    }
  };

  const handleDuplicate = () => {
    handleCopy(); // Duplicate uses the same logic as copy
  };

  const handleDelete = () => {
    if (!selected) return;
    actions.delete(selected);
  };

  useKeyboardShortcuts({
    onCopy: handleCopy,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
    onShowHelp: () => setShowHelp(true),
  });

  const shortcuts = [
    { keys: ["Ctrl", "Z"], description: "Undo" },
    { keys: ["Ctrl", "Y"], description: "Redo" },
    { keys: ["Ctrl", "Shift", "Z"], description: "Redo (alternative)" },
    { keys: ["Ctrl", "C"], description: "Copy component" },
    { keys: ["Ctrl", "D"], description: "Duplicate component" },
    { keys: ["Delete"], description: "Delete component" },
    { keys: ["Backspace"], description: "Delete component" },
    { keys: ["Esc"], description: "Deselect component" },
    { keys: ["?"], description: "Show keyboard shortcuts" },
  ];

  const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return (
    <>
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
              <button onClick={() => setShowHelp(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          {keyIndex > 0 && <span className="text-gray-400 mx-1">+</span>}
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded shadow-sm">
                            {key === "Ctrl" && isMac ? "⌘" : key === "Ctrl" ? "Ctrl" : key === "Shift" ? "Shift" : key}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Note: Shortcuts are disabled when typing in input fields, text areas, or editable content.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

