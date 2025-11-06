"use client";

import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { useLayer } from '@craftjs/layers';
import { ChevronRight, ChevronDown, Edit3 } from 'lucide-react';

export const CustomLayerHeader = () => {
  const {
    id,
    depth,
    expanded,
    children,
    connectors: { drag, layerHeader },
    actions: { toggleLayer }
  } = useLayer((layer) => ({
    expanded: layer.expanded
  }));

  const { displayName, actions } = useEditor((state) => {
    const node = state.nodes[id];
    return {
      displayName: node?.data.props.customName || node?.data.displayName || node?.data.name || 'Component'
    };
  });

  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');

  // Start rename process
  const handleRename = (e) => {
    e.stopPropagation();
    setNewName(displayName);
    setIsRenaming(true);
  };

  // Save new name
  const handleRenameSubmit = () => {
    if (newName.trim()) {
      actions.setProp(id, (props) => {
        props.customName = newName.trim();
      });
    }
    setIsRenaming(false);
  };

  // Cancel rename
  const handleRenameCancel = () => {
    setIsRenaming(false);
    setNewName('');
  };

  return (
    <div
      ref={(ref) => drag(layerHeader(ref))}
      className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer`}
      style={{ paddingLeft: `${depth * 20 + 8}px` }}
    >
      {/* Expand/Collapse Button */}
      {children?.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLayer();
          }}
          className="mr-1 p-1 hover:bg-gray-200 rounded"
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
      )}

      {/* Component Name */}
      <div className="flex-1 flex items-center gap-2">
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') handleRenameCancel();
            }}
            onBlur={handleRenameSubmit}
            className="flex-1 px-1 py-0 text-sm border border-blue-500 rounded focus:outline-none"
            autoFocus
          />
        ) : (
          <>
            <span className="text-sm text-gray-800 flex-1">{displayName}</span>
            <button
              onClick={handleRename}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
              title="Rename"
            >
              <Edit3 size={12} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};