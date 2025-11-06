"use client";

import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { MoreVertical, Copy, ArrowUp, Trash2 } from "lucide-react";

interface RenderNodeProps {
  element: React.ReactElement;
}

export const RenderNode: React.FC<RenderNodeProps> = ({ element }) => {
  const {
    id,
    connectors: { connect, drag },
    selected,
    name,
    isCanvas,
  } = useNode((node) => ({
    selected: node.events.selected,
    name: node.data.displayName || node.data.name,
    isCanvas: node.data.isCanvas,
  }));

  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleCopy = () => {
    const node = query.node(id).get();
    const newNodeTree = query.parseReactElement(React.createElement(node.data.type, node.data.props)).toNodeTree();
    actions.addNodeTree(newNodeTree, query.node(node.data.parent || "ROOT").get().id);
    setShowContextMenu(false);
  };

  const handleDelete = () => {
    actions.delete(id);
    setShowContextMenu(false);
  };

  const handleSelectParent = () => {
    const node = query.node(id).get();
    if (node.data.parent && node.data.parent !== "ROOT") {
      actions.selectNode(node.data.parent);
    }
    setShowContextMenu(false);
  };

  const isRoot = query.node(id).isRoot();

  // Don't show handles if editor is disabled or if it's the root node
  if (!enabled || isRoot) {
    return element;
  }

  return (
    <div
      ref={(ref) => {
        if (isCanvas) {
          connect(ref);
        } else {
          connect(drag(ref));
        }
      }}
      className={`
        relative
        ${selected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"}
        transition-all duration-200
      `}
    >
      {/* Selection Indicator */}
      {selected && (
        <>
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t-md font-medium z-10">{name}</div>
          <div className="absolute -top-6 right-0 z-10">
            <button onClick={() => setShowContextMenu(!showContextMenu)} className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-t-md transition-colors" title="Component Actions">
              <MoreVertical size={12} />
            </button>

            {/* Context Menu */}
            {showContextMenu && (
              <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[120px]">
                {/* Copy */}
                <button onClick={handleCopy} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <Copy size={14} />
                  Copy
                </button>

                {/* Select Parent */}
                {!isRoot && (
                  <button onClick={handleSelectParent} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <ArrowUp size={14} />
                    Select Parent
                  </button>
                )}

                {/* Delete */}
                <button onClick={handleDelete} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {element}
    </div>
  );
};
