"use client";

import { useEditor } from "@craftjs/core";

export const Toolbar = () => {
  const { actions, query } = useEditor();

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4">
      <h1 className="text-xl font-bold text-gray-900">Website Builder</h1>
      <div className="flex gap-2">
        <button 
          onClick={() => console.log(query.serialize())}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Preview
        </button>
        <button 
          onClick={() => actions.history.undo()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Undo
        </button>
      </div>
    </div>
  );
};