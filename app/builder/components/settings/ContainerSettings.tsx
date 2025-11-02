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
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
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
        <div className="space-y-4">
          {/* Container Type Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button
              onClick={() => setOpenAccordion(openAccordion === "containerType" ? "" : "containerType")}
              className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Container Type
              <span className={`transform transition-transform ${openAccordion === "containerType" ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openAccordion === "containerType" && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Container Width
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {["full", "boxed", "custom"].map((width) => (
                      <button
                        key={width}
                        onClick={() => actions.setProp((props) => props.containerWidth = width)}
                        className={`px-3 py-2 text-xs border rounded capitalize ${
                          (props.containerWidth || "full") === width
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {width === "full" ? "Full Width" : width}
                      </button>
                    ))}
                  </div>
                </div>
                
                {props.containerWidth === "custom" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Width
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={props.customWidthUnit === "%" ? "10" : "200"}
                        max={props.customWidthUnit === "%" ? "100" : "2000"}
                        value={props.customWidth || (props.customWidthUnit === "%" ? 100 : 1200)}
                        onChange={(e) => actions.setProp((props) => props.customWidth = parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={props.customWidth || (props.customWidthUnit === "%" ? 100 : 1200)}
                          onChange={(e) => actions.setProp((props) => props.customWidth = parseInt(e.target.value) || (props.customWidthUnit === "%" ? 100 : 1200))}
                          className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white"
                        />
                        <select
                          value={props.customWidthUnit || "px"}
                          onChange={(e) => actions.setProp((props) => {
                            props.customWidthUnit = e.target.value;
                            props.customWidth = e.target.value === "%" ? 100 : 1200;
                          })}
                          className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white"
                        >
                          <option value="px">px</option>
                          <option value="%">%</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {props.flexBasis && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width (%)
                    </label>
                    <input
                      type="number"
                      value={props.flexBasis || 50}
                      onChange={(e) => actions.setProp((props) => props.flexBasis = parseInt(e.target.value))}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Layout Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button
              onClick={() => setOpenAccordion(openAccordion === "layout" ? "" : "layout")}
              className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Layout
              <span className={`transform transition-transform ${openAccordion === "layout" ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openAccordion === "layout" && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layout Type
                  </label>
                  <select
                    value={props.layout || "block"}
                    onChange={(e) => actions.setProp((props) => props.layout = e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                  >
                    <option value="block">Block</option>
                    <option value="flex">Flex</option>
                  </select>
                </div>

                {props.layout === "flex" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gap
                    </label>
                    <input
                      type="number"
                      value={props.gap || 4}
                      onChange={(e) => actions.setProp((props) => props.gap = parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Style Tab */}
      {activeTab === "style" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Padding
            </label>
            <input
              type="number"
              value={props.padding || 20}
              onChange={(e) => actions.setProp((props) => props.padding = parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Margin
            </label>
            <input
              type="number"
              value={props.margin || 0}
              onChange={(e) => actions.setProp((props) => props.margin = parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={props.backgroundColor || "#ffffff"}
                onChange={(e) => actions.setProp((props) => props.backgroundColor = e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={props.backgroundColor || "#ffffff"}
                onChange={(e) => actions.setProp((props) => props.backgroundColor = e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius
            </label>
            <input
              type="number"
              value={props.borderRadius || 0}
              onChange={(e) => actions.setProp((props) => props.borderRadius = parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            />
          </div>
        </div>
      )}
      
      {/* Advanced Tab */}
      {activeTab === "advanced" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CSS Classes
            </label>
            <input
              type="text"
              value={props.className || ""}
              onChange={(e) => actions.setProp((props) => props.className = e.target.value)}
              placeholder="custom-class"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};