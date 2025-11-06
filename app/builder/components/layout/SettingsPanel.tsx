"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { Layers } from "@craftjs/layers";
import { Settings, Layers as LayersIcon } from "lucide-react";

export const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState("settings");

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

  const tabs = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "layers", label: "Layers", icon: LayersIcon },
  ];

  return (
    <div className="w-80 bg-white border-l flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors flex-1 justify-center ${activeTab === tab.id ? "border-blue-500 text-blue-600 bg-blue-50" : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "settings" && (
          <div className="p-4">
            {selected ? (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 border rounded">
                  <p className="text-sm font-medium text-gray-700">Selected: {selected.name}</p>
                </div>
                {selected.settings && <div className="bg-white">{React.createElement(selected.settings)}</div>}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Select a component to edit its properties</p>
            )}
          </div>
        )}

        <div className={`p-4 bg-white text-gray-900 ${activeTab === "layers" ? "block" : "hidden"}`}>
          <Layers expandRootOnLoad={true} />
        </div>
      </div>
    </div>
  );
};
