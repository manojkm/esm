"use client";

import { useNode } from "@craftjs/core";

export const HeadingSettings = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Heading Level</label>
        <select 
          value={props.level || "h2"}
          onChange={(e) => actions.setProp((props) => props.level = e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
        <select 
          value={props.size || "text-2xl"}
          onChange={(e) => actions.setProp((props) => props.size = e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          <option value="text-sm">Small</option>
          <option value="text-base">Base</option>
          <option value="text-lg">Large</option>
          <option value="text-xl">XL</option>
          <option value="text-2xl">2XL</option>
          <option value="text-3xl">3XL</option>
          <option value="text-4xl">4XL</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <select 
          value={props.color || "text-gray-900"}
          onChange={(e) => actions.setProp((props) => props.color = e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          <option value="text-gray-900">Black</option>
          <option value="text-gray-600">Gray</option>
          <option value="text-blue-600">Blue</option>
          <option value="text-green-600">Green</option>
          <option value="text-red-600">Red</option>
          <option value="text-purple-600">Purple</option>
        </select>
      </div>
    </div>
  );
};