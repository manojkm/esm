"use client";

import { useEditor } from "@craftjs/core";
import { Undo, Redo } from "lucide-react";

export const Toolbar = () => {
  const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo()
  }));

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
          disabled={!canUndo}
          className={`flex items-center gap-1 px-3 py-2 rounded transition-colors ${
            canUndo 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Undo size={16} />
          Undo
        </button>
        <button 
          onClick={() => actions.history.redo()}
          disabled={!canRedo}
          className={`flex items-center gap-1 px-3 py-2 rounded transition-colors ${
            canRedo 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Redo size={16} />
          Redo
        </button>
      </div>
    </div>
  );
};