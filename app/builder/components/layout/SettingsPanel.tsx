"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { Layers } from "@craftjs/layers";
import { Settings, Layers as LayersIcon, Copy, Trash2, ArrowUp } from "lucide-react";

interface SelectedComponent {
  id: string;
  name: string;
  settings?: React.ElementType;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

export const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState("settings");

  const { selected, actions, query } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    let selected: SelectedComponent | undefined;

    if (currentNodeId) {
      const node = state.nodes[currentNodeId];
      const relatedSettings = node.related?.settings;

      selected = {
        id: currentNodeId,
        name: node.data.name,
        settings: typeof relatedSettings === "function" ? relatedSettings : undefined,
      };
    }

    return { selected };
  });

  // const handleCopy = () => {
  //   if (!selected) return;
  //   const node = query.node(selected.id).get();
  //   const newNodeTree = query.parseReactElement(React.createElement(node.data.type, node.data.props)).toNodeTree();
  //   actions.addNodeTree(newNodeTree, query.node(node.data.parent || "ROOT").get().id);
  // };

  const handleCopy = () => {
    if (!selected) return;
    const node = query.node(selected.id).get();
    const parent = node.data.parent;

    if (parent !== null) {
      // Helper function to recursively build React element tree with children
      const buildElementTree = (nodeId: string): React.ReactElement => {
        const currentNode = query.node(nodeId).get();
        const nodeChildren = currentNode.data.nodes || [];

        // Recursively build children elements
        const childElements = nodeChildren.map((childId: string) => buildElementTree(childId));

        // Create React element with type, props, and children
        return React.createElement(currentNode.data.type, currentNode.data.props, ...childElements);
      };

      // Build the complete element tree
      const elementTree = buildElementTree(selected.id);

      // Parse the element tree to create a new node tree with fresh IDs
      const newNodeTree = query.parseReactElement(elementTree).toNodeTree();

      // Add the cloned tree to the parent
      actions.addNodeTree(newNodeTree, parent);
    }
  };

  const handleDelete = () => {
    if (!selected) return;
    actions.delete(selected.id);
  };

  // const handleSelectParent = () => {
  //   if (!selected) return;
  //   const node = query.node(selected.id).get();
  //   const parentId = node.data.parent;
  //   console.log("Select Parent - Current ID:", selected.id, "Parent ID:", parentId);
  //   if (parentId && parentId !== "ROOT") {
  //     console.log("Selecting parent:", parentId);
  //     actions.selectNode(parentId);
  //   } else {
  //     console.log("Cannot select parent - parentId is:", parentId);
  //   }
  // };

  const handleSelectParent = () => {
    if (!selected) return;
    const parentId = query.node(selected.id).get().data.parent;
    if (parentId) {
      actions.selectNode(parentId);
    }
  };

  const isRoot = selected ? query.node(selected.id).isRoot() : false;

  const tabs: Tab[] = [
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
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Selected: {selected.name}</p>
                    <div className="flex items-center gap-1">
                      <button onClick={handleCopy} className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Copy">
                        <Copy size={14} />
                      </button>
                      {!isRoot && (
                        <button onClick={handleSelectParent} className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Select Parent">
                          <ArrowUp size={14} />
                        </button>
                      )}
                      <button onClick={handleDelete} className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                {selected.settings && (
                  <>
                    {/* {console.log("Rendering settings for", selected.name, selected.settings)} */}
                    <div className="bg-white">{React.createElement(selected.settings)}</div>
                  </>
                )}
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
