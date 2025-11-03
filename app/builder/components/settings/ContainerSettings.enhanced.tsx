"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";

export const ContainerSettings = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props
  }));
  
  const [activeTab, setActiveTab] = useState("general");
  const [openAccordion, setOpenAccordion] = useState("containerType");

  const tabs = [
    { id: "general", label: "General", icon: "📐" },
    { id: "style", label: "Style", icon: "🎨" },
    { id: "spacing", label: "Spacing", icon: "📏" },
    { id: "advanced", label: "Advanced", icon: "⚙️" }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-3">
          {/* Container Width */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Container Width
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { value: "full", label: "Full" },
                { value: "boxed", label: "Boxed" },
                { value: "custom", label: "Custom" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => actions.setProp((props) => props.containerWidth = option.value)}
                  className={`px-2 py-1.5 text-xs border rounded ${
                    (props.containerWidth || "full") === option.value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {props.containerWidth === "custom" && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Custom Width
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={props.customWidth || 1200}
                  onChange={(e) => actions.setProp((props) => props.customWidth = parseInt(e.target.value))}
                  className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded text-gray-900 bg-white"
                />
                <select
                  value={props.customWidthUnit || "px"}
                  onChange={(e) => actions.setProp((props) => props.customWidthUnit = e.target.value)}
                  className="px-2 py-1.5 text-xs border border-gray-300 rounded text-gray-900 bg-white"
                >
                  <option value="px">px</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>
          )}

          {/* Layout Type */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Layout
            </label>
            <select
              value={props.layout || "block"}
              onChange={(e) => actions.setProp((props) => props.layout = e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded text-gray-900 bg-white"
            >
              <option value="block">Block</option>
              <option value="flex">Flex</option>
            </select>
          </div>

          {props.layout === "flex" && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Gap (px)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={props.gap || 4}
                onChange={(e) => actions.setProp((props) => props.gap = parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 text-center">{(props.gap || 4) * 4}px</div>
            </div>
          )}
        </div>
      )}
      
      {/* Style Tab */}
      {activeTab === "style" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Background
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.backgroundColor || "#ffffff"}
                onChange={(e) => actions.setProp((props) => props.backgroundColor = e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={props.backgroundColor || "#ffffff"}
                onChange={(e) => actions.setProp((props) => props.backgroundColor = e.target.value)}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded text-gray-900 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Border Radius (px)
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={props.borderRadius || 0}
              onChange={(e) => actions.setProp((props) => props.borderRadius = parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-xs text-gray-500 text-center">{props.borderRadius || 0}px</div>
          </div>
        </div>
      )}

      {/* Spacing Tab */}
      {activeTab === "spacing" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Padding (px)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={props.padding || 20}
              onChange={(e) => actions.setProp((props) => props.padding = parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-xs text-gray-500 text-center">{props.padding || 20}px</div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Margin (px)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={props.margin || 0}
              onChange={(e) => actions.setProp((props) => props.margin = parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-xs text-gray-500 text-center">{props.margin || 0}px</div>
          </div>
        </div>
      )}
      
      {/* Advanced Tab */}
      {activeTab === "advanced" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              CSS Classes
            </label>
            <input
              type="text"
              value={props.className || ""}
              onChange={(e) => actions.setProp((props) => props.className = e.target.value)}
              placeholder="custom-class another-class"
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded text-gray-900 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};