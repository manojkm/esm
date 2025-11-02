"use client";

import { useNode } from "@craftjs/core";

export const IconSettings = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props
  }));

  const commonIcons = ["⭐", "❤️", "🚀", "💡", "🎯", "📱", "💻", "🌟", "🔥", "⚡", "🎨", "📊"];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {commonIcons.map((iconOption) => (
            <button
              key={iconOption}
              onClick={() => actions.setProp((props) => props.icon = iconOption)}
              className={`p-2 border rounded text-lg hover:bg-gray-100 ${
                props.icon === iconOption ? 'bg-blue-100 border-blue-500' : ''
              }`}
            >
              {iconOption}
            </button>
          ))}
        </div>
        <input 
          type="text" 
          value={props.icon || "⭐"}
          onChange={(e) => actions.setProp((props) => props.icon = e.target.value)}
          className="w-full p-2 border rounded text-sm"
          placeholder="Enter emoji or text"
        />
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
    </div>
  );
};