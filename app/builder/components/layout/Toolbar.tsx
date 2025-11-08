"use client";

import { useEditor } from "@craftjs/core";
import { Undo, Redo, Save, Upload } from "lucide-react";
import lz from "lz-string";
import { useState } from "react";

export const Toolbar = () => {
  const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [saveStatus, setSaveStatus] = useState("");

  const handleSave = () => {
    try {
      const json = query.serialize();
      const compressed = lz.compressToBase64(json);
      localStorage.setItem("craftjs-design", compressed);
      setSaveStatus("Saved!");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      setSaveStatus("Save failed");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  const handleLoad = () => {
    try {
      const compressed = localStorage.getItem("craftjs-design");
      if (compressed) {
        const json = lz.decompressFromBase64(compressed);
        actions.deserialize(json);
        setSaveStatus("Loaded!");
        setTimeout(() => setSaveStatus(""), 2000);
      } else {
        setSaveStatus("No saved design");
        setTimeout(() => setSaveStatus(""), 2000);
      }
    } catch (error) {
      setSaveStatus("Load failed");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4">
      <h1 className="text-xl font-bold text-gray-900">Website Builder</h1>
      <div className="flex gap-2 items-center">
        <button onClick={handleSave} className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          <Save size={16} />
          Save
        </button>
        <button onClick={handleLoad} className="flex items-center gap-1 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
          <Upload size={16} />
          Load
        </button>
        {saveStatus && <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{saveStatus}</span>}

        <button onClick={() => actions.history.undo()} disabled={!canUndo} className={`flex items-center gap-1 px-3 py-2 rounded transition-colors ${canUndo ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
          <Undo size={16} />
          Undo
        </button>
        <button onClick={() => actions.history.redo()} disabled={!canRedo} className={`flex items-center gap-1 px-3 py-2 rounded transition-colors ${canRedo ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
          <Redo size={16} />
          Redo
        </button>
      </div>
    </div>
  );
};
