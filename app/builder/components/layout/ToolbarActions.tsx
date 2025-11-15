"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import lz from "lz-string";
import { CombinedToolbar } from "./CombinedToolbar";

interface ToolbarActionsProps {
  isPreviewMode: boolean;
  onPreviewToggle: () => void;
}

export const ToolbarActions: React.FC<ToolbarActionsProps> = ({ isPreviewMode, onPreviewToggle }) => {
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
    <CombinedToolbar
      isPreviewMode={isPreviewMode}
      onPreviewToggle={onPreviewToggle}
      onUndo={() => actions.history.undo()}
      onRedo={() => actions.history.redo()}
      onSave={handleSave}
      onLoad={handleLoad}
      canUndo={canUndo}
      canRedo={canRedo}
      saveStatus={saveStatus}
    />
  );
};

