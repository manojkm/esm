"use client";

import React from "react";
import { useNode } from "@craftjs/core";

export const ContainerSettings = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Container Settings</h3>
      
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Layout
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
          <>
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
          </>
        )}

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
    </div>
  );
};