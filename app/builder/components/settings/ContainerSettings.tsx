"use client";

import { useNode } from "@craftjs/core";

export const ContainerSettings = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="space-y-4">
      {/* Layout Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
        <select 
          value={props.layout || "block"}
          onChange={(e) => actions.setProp((props) => props.layout = e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          <option value="block">Block</option>
          <option value="flex">Flexbox</option>
          <option value="grid">Grid</option>
        </select>
      </div>

      {/* Flex Options */}
      {props.layout === "flex" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
            <select 
              value={props.flexDirection || "row"}
              onChange={(e) => actions.setProp((props) => props.flexDirection = e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="row">Row</option>
              <option value="col">Column</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Justify</label>
            <select 
              value={props.justifyContent || "start"}
              onChange={(e) => actions.setProp((props) => props.justifyContent = e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="between">Space Between</option>
              <option value="around">Space Around</option>
            </select>
          </div>
        </>
      )}

      {/* Grid Options */}
      {props.layout === "grid" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
          <input 
            type="range" 
            min="1" 
            max="6" 
            value={props.gridCols || 2}
            onChange={(e) => actions.setProp((props) => props.gridCols = parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-600">{props.gridCols || 2} columns</span>
        </div>
      )}

      {/* Spacing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
        <input 
          type="range" 
          min="0" 
          max="12" 
          value={props.padding || 4}
          onChange={(e) => actions.setProp((props) => props.padding = parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-gray-600">{props.padding || 4}</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gap</label>
        <input 
          type="range" 
          min="0" 
          max="8" 
          value={props.gap || 2}
          onChange={(e) => actions.setProp((props) => props.gap = parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-gray-600">{props.gap || 2}</span>
      </div>

      {/* Background */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
        <select 
          value={props.background || "bg-gray-50"}
          onChange={(e) => actions.setProp((props) => props.background = e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          <option value="bg-white">White</option>
          <option value="bg-gray-50">Light Gray</option>
          <option value="bg-gray-100">Gray</option>
          <option value="bg-blue-50">Light Blue</option>
          <option value="bg-green-50">Light Green</option>
          <option value="bg-red-50">Light Red</option>
          <option value="bg-purple-50">Light Purple</option>
        </select>
      </div>
    </div>
  );
};