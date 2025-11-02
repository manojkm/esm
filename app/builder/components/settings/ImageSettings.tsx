"use client";

import { useNode } from "@craftjs/core";

export const ImageSettings = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
        <input 
          type="url" 
          value={props.src || ""}
          onChange={(e) => actions.setProp((props) => props.src = e.target.value)}
          className="w-full p-2 border rounded text-sm"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
        <input 
          type="text" 
          value={props.alt || ""}
          onChange={(e) => actions.setProp((props) => props.alt = e.target.value)}
          className="w-full p-2 border rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
        <input 
          type="number" 
          value={props.width || 300}
          onChange={(e) => actions.setProp((props) => props.width = e.target.value)}
          className="w-full p-2 border rounded text-sm"
        />
      </div>
    </div>
  );
};