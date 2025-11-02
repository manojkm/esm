"use client";

import React from "react";
import { useEditor } from "@craftjs/core";

interface ContainerLayoutPickerProps {
  onSelect: (layout: any) => void;
  onClose: () => void;
}

export const ContainerLayoutPicker = ({ onSelect, onClose }: ContainerLayoutPickerProps) => {
  const layouts = [
    // Single column
    { id: 1, name: "Single", cols: [100] },
    // Two columns
    { id: 2, name: "Two Equal", cols: [50, 50] },
    { id: 3, name: "Two 1/3 + 2/3", cols: [33, 67] },
    { id: 4, name: "Two 2/3 + 1/3", cols: [67, 33] },
    { id: 5, name: "Two 1/4 + 3/4", cols: [25, 75] },
    { id: 6, name: "Two 3/4 + 1/4", cols: [75, 25] },
    // Three columns
    { id: 7, name: "Three Equal", cols: [33, 33, 33] },
    { id: 8, name: "Three 1/2 + 1/4 + 1/4", cols: [50, 25, 25] },
    { id: 9, name: "Three 1/4 + 1/2 + 1/4", cols: [25, 50, 25] },
    { id: 10, name: "Three 1/4 + 1/4 + 1/2", cols: [25, 25, 50] },
    // Four columns
    { id: 11, name: "Four Equal", cols: [25, 25, 25, 25] },
    // Five columns
    { id: 12, name: "Five Equal", cols: [20, 20, 20, 20, 20] }
  ];

  const LayoutPreview = ({ layout }) => (
    <div 
      className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
      onClick={() => onSelect(layout)}
    >
      <div className="flex gap-1 h-16">
        {layout.cols.map((width, index) => (
          <div
            key={index}
            className="bg-gray-400 rounded"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
      <div className="text-xs text-gray-600 mt-2 text-center">{layout.name}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-blue-500 text-xl">📦</span>
              <h2 className="text-xl font-semibold text-gray-900">Container</h2>
            </div>
            <p className="text-gray-600">Select a container layout to start with.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {layouts.map((layout) => (
            <LayoutPreview key={layout.id} layout={layout} />
          ))}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};