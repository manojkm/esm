"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { RotateCcw } from "lucide-react";
import { BackgroundControls, BorderControls, ColorControls, BoxShadowControls, SpacingControls, PositionControls, ResponsiveControls, CSSControls, AttributesControls } from "./shared/StyleControls";

export const ContainerSettings = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props,
  }));

  const [activeTab, setActiveTab] = useState("general");
  const [openAccordion, setOpenAccordion] = useState("containerType");

  // Check if this is a child container (has flexBasis prop)
  const isChildContainer = props.flexBasis !== null && props.flexBasis !== undefined;

  const tabs = [
    { id: "general", label: "General", icon: "" },
    { id: "style", label: "Style", icon: "" },
    { id: "advanced", label: "Advanced", icon: "" },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-4">
          {/* Container Type Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "containerType" ? "" : "containerType")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              Container Type
              <span className={`transform transition-transform ${openAccordion === "containerType" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "containerType" && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                {isChildContainer ? (
                  // Child Container Settings - Only Width Control
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (%)</label>
                    <input type="number" value={props.flexBasis || 50} onChange={(e) => actions.setProp((props) => (props.flexBasis = parseInt(e.target.value)))} min="1" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white" />
                  </div>
                ) : (
                  // Parent Container Settings - All Controls
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Container Width</label>
                      <div className="grid grid-cols-3 gap-1">
                        {["full", "boxed", "custom"].map((width) => (
                          <button key={width} onClick={() => actions.setProp((props) => (props.containerWidth = width))} className={`px-3 py-2 text-xs border rounded capitalize ${(props.containerWidth || "full") === width ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                            {width === "full" ? "Full Width" : width}
                          </button>
                        ))}
                      </div>
                    </div>

                    {props.containerWidth === "custom" && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Custom Width</label>
                          {(props.customWidth && props.customWidth !== (props.customWidthUnit === "%" ? 100 : 1200)) && (
                            <button
                              onClick={() =>
                                actions.setProp((props) => {
                                  props.customWidth = props.customWidthUnit === "%" ? 100 : 1200;
                                })
                              }
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="Reset to default"
                            >
                              <RotateCcw size={14} />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="range" min={props.customWidthUnit === "%" ? "10" : "100"} max={props.customWidthUnit === "%" ? "100" : "1600"} value={props.customWidth || (props.customWidthUnit === "%" ? 100 : 1200)} onChange={(e) => actions.setProp((props) => (props.customWidth = parseInt(e.target.value)))} className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                          <div className="flex items-center gap-1">
                            <input type="number" value={props.customWidth || (props.customWidthUnit === "%" ? 100 : 1200)} onChange={(e) => actions.setProp((props) => (props.customWidth = parseInt(e.target.value) || (props.customWidthUnit === "%" ? 100 : 1200)))} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
                            <select
                              value={props.customWidthUnit || "px"}
                              onChange={(e) =>
                                actions.setProp((props) => {
                                  props.customWidthUnit = e.target.value;
                                  props.customWidth = e.target.value === "%" ? 100 : 1200;
                                })
                              }
                              className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white"
                            >
                              <option value="px">px</option>
                              <option value="%">%</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {(props.containerWidth === "full" || !props.containerWidth) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content Width</label>
                        <div className="grid grid-cols-2 gap-1">
                          {["boxed", "full"].map((contentWidth) => (
                            <button key={contentWidth} onClick={() => actions.setProp((props) => (props.contentWidth = contentWidth))} className={`px-3 py-2 text-xs border rounded capitalize ${(props.contentWidth || "boxed") === contentWidth ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                              {contentWidth === "full" ? "Full Width" : "Boxed"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {(props.containerWidth === "full" || !props.containerWidth) && (props.contentWidth === "boxed" || !props.contentWidth) && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Content Box Width</label>
                          {(props.contentBoxWidth && props.contentBoxWidth !== (props.contentBoxWidthUnit === "%" ? 100 : 1200)) && (
                            <button
                              onClick={() =>
                                actions.setProp((props) => {
                                  props.contentBoxWidth = props.contentBoxWidthUnit === "%" ? 100 : 1200;
                                })
                              }
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="Reset to default"
                            >
                              <RotateCcw size={14} />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="range" min={props.contentBoxWidthUnit === "%" ? "10" : "100"} max={props.contentBoxWidthUnit === "%" ? "100" : "1600"} value={props.contentBoxWidth || (props.contentBoxWidthUnit === "%" ? 100 : 1200)} onChange={(e) => actions.setProp((props) => (props.contentBoxWidth = parseInt(e.target.value)))} className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                          <div className="flex items-center gap-1">
                            <input type="number" value={props.contentBoxWidth || (props.contentBoxWidthUnit === "%" ? 100 : 1200)} onChange={(e) => actions.setProp((props) => (props.contentBoxWidth = parseInt(e.target.value) || (props.contentBoxWidthUnit === "%" ? 100 : 1200)))} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-l text-gray-900 bg-white" />
                            <select
                              value={props.contentBoxWidthUnit || "px"}
                              onChange={(e) =>
                                actions.setProp((props) => {
                                  props.contentBoxWidthUnit = e.target.value;
                                  props.contentBoxWidth = e.target.value === "%" ? 100 : 1200;
                                })
                              }
                              className="px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r text-gray-900 bg-white"
                            >
                              <option value="px">px</option>
                              <option value="%">%</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Minimum Height</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={props.enableMinHeight || false}
                            onChange={(e) =>
                              actions.setProp((props) => {
                                props.enableMinHeight = e.target.checked;
                                if (!e.target.checked) {
                                  props.minHeight = null;
                                } else {
                                  props.minHeight = props.minHeightUnit === "vh" ? 50 : 450;
                                }
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      {props.enableMinHeight && (
                        <div className="flex items-center gap-2">
                          <input type="range" min={props.minHeightUnit === "vh" ? "10" : "50"} max={props.minHeightUnit === "vh" ? "100" : "1000"} value={props.minHeight || (props.minHeightUnit === "vh" ? 50 : 450)} onChange={(e) => actions.setProp((props) => (props.minHeight = parseInt(e.target.value)))} className="flex-1 min-w-0 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">px</span>
                            <span className="text-xs text-gray-500">vh</span>
                          </div>
                          <input type="number" value={props.minHeight || (props.minHeightUnit === "vh" ? 50 : 450)} onChange={(e) => actions.setProp((props) => (props.minHeight = parseInt(e.target.value) || (props.minHeightUnit === "vh" ? 50 : 450)))} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Equal Height</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={props.equalHeight || false} onChange={(e) => actions.setProp((props) => (props.equalHeight = e.target.checked))} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Enabling this will change the Align Items value to Stretch.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">HTML Tag</label>
                      <select value={props.htmlTag || "div"} onChange={(e) => actions.setProp((props) => (props.htmlTag = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                        <option value="div">div</option>
                        <option value="section">section</option>
                        <option value="article">article</option>
                        <option value="header">header</option>
                        <option value="footer">footer</option>
                        <option value="main">main</option>
                        <option value="aside">aside</option>
                        <option value="nav">nav</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Overflow</label>
                      <select value={props.overflow || "visible"} onChange={(e) => actions.setProp((props) => (props.overflow = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white">
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Layout Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "layout" ? "" : "layout")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              Layout
              <span className={`transform transition-transform ${openAccordion === "layout" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "layout" && (
              <div className="p-4 border-t border-gray-200 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Layout Type</label>
                  <div className="grid grid-cols-2 gap-1">
                    {["block", "flex"].map((layoutType) => (
                      <button key={layoutType} onClick={() => actions.setProp((props) => (props.layout = layoutType))} className={`px-3 py-2 text-xs border rounded capitalize ${(props.layout || "block") === layoutType ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                        {layoutType}
                      </button>
                    ))}
                  </div>
                </div>

                {props.layout === "flex" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { value: "row", label: "Row" },
                          { value: "column", label: "Column" },
                          { value: "row-reverse", label: "Row Reverse" },
                          { value: "column-reverse", label: "Column Reverse" },
                        ].map((direction) => (
                          <button key={direction.value} onClick={() => actions.setProp((props) => (props.flexDirection = direction.value))} className={`px-2 py-2 text-xs border rounded ${(props.flexDirection || "row") === direction.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                            {direction.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Justify Content</label>
                      <select value={props.justifyContent || "flex-start"} onChange={(e) => actions.setProp((props) => (props.justifyContent = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm">
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="flex-end">End</option>
                        <option value="space-between">Space Between</option>
                        <option value="space-around">Space Around</option>
                        <option value="space-evenly">Space Evenly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Align Items</label>
                      <select value={props.alignItems || "stretch"} onChange={(e) => actions.setProp((props) => (props.alignItems = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm">
                        <option value="stretch">Stretch</option>
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="flex-end">End</option>
                        <option value="baseline">Baseline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Wrap</label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { value: "nowrap", label: "No Wrap" },
                          { value: "wrap", label: "Wrap" },
                          { value: "wrap-reverse", label: "Wrap Reverse" },
                        ].map((wrap) => (
                          <button key={wrap.value} onClick={() => actions.setProp((props) => (props.flexWrap = wrap.value))} className={`px-2 py-2 text-xs border rounded ${(props.flexWrap || "nowrap") === wrap.value ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                            {wrap.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {props.flexWrap === "wrap" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Align Content</label>
                        <select value={props.alignContent || "stretch"} onChange={(e) => actions.setProp((props) => (props.alignContent = e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white text-sm">
                          <option value="stretch">Stretch</option>
                          <option value="flex-start">Start</option>
                          <option value="center">Center</option>
                          <option value="flex-end">End</option>
                          <option value="space-between">Space Between</option>
                          <option value="space-around">Space Around</option>
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Style Tab */}
      {activeTab === "style" && (
        <div className="space-y-4">
          {/* Spacing Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "spacing" ? "" : "spacing")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              Spacing
              <span className={`transform transition-transform ${openAccordion === "spacing" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "spacing" && (
              <div className="p-4 border-t border-gray-200">
                <SpacingControls props={props} actions={actions} />
              </div>
            )}
          </div>

          {/* Background Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "background" ? "" : "background")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              Background
              <span className={`transform transition-transform ${openAccordion === "background" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "background" && (
              <div className="p-4 border-t border-gray-200">
                <BackgroundControls props={props} actions={actions} />
              </div>
            )}
          </div>

          {/* Border Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "border" ? "" : "border")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              Border
              <span className={`transform transition-transform ${openAccordion === "border" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "border" && (
              <div className="p-4 border-t border-gray-200">
                <BorderControls props={props} actions={actions} />
              </div>
            )}
          </div>

          {/* Box Shadow Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "boxShadow" ? "" : "boxShadow")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              Box Shadow
              <span className={`transform transition-transform ${openAccordion === "boxShadow" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "boxShadow" && (
              <div className="p-4 border-t border-gray-200">
                <BoxShadowControls props={props} actions={actions} />
              </div>
            )}
          </div>

          {/* Color Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "color" ? "" : "color")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              Color
              <span className={`transform transition-transform ${openAccordion === "color" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "color" && (
              <div className="p-4 border-t border-gray-200">
                <ColorControls props={props} actions={actions} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === "advanced" && (
        <div className="space-y-4">
          {/* CSS Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "css" ? "" : "css")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              CSS
              <span className={`transform transition-transform ${openAccordion === "css" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "css" && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                <CSSControls props={props} actions={actions} />
              </div>
            )}
          </div>

          {/* Attributes Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "attributes" ? "" : "attributes")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              Attributes
              <span className={`transform transition-transform ${openAccordion === "attributes" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "attributes" && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                <AttributesControls props={props} actions={actions} />
              </div>
            )}
          </div>

          {/* Responsive Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "responsive" ? "" : "responsive")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              Responsive
              <span className={`transform transition-transform ${openAccordion === "responsive" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "responsive" && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                <ResponsiveControls props={props} actions={actions} />
              </div>
            )}
          </div>

          {/* Position Accordion */}
          <div className="border border-gray-200 rounded-md">
            <button onClick={() => setOpenAccordion(openAccordion === "position" ? "" : "position")} className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
              Position
              <span className={`transform transition-transform ${openAccordion === "position" ? "rotate-180" : ""}`}>▼</span>
            </button>
            {openAccordion === "position" && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                <PositionControls props={props} actions={actions} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
