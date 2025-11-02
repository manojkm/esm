"use client";

import React from "react";
import { useEditor } from "@craftjs/core";

export const SettingsPanel = () => {
  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
      };
    }

    return { selected };
  });

  return (
    <div className="w-80 bg-gray-100 p-4 border-l overflow-y-auto">
      <h3 className="font-semibold mb-4 text-gray-900">Settings</h3>
      {selected ? (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded">
            <p className="text-sm font-medium text-gray-700">Selected: {selected.name}</p>
          </div>
          {selected.settings && (
            <div className="bg-white p-4 border rounded">
              {React.createElement(selected.settings)}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">Select a component to edit its properties</p>
      )}
    </div>
  );
};