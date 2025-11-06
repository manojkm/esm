"use client";

import React from "react";
import { Layers } from "@craftjs/layers";
import { Layers as LayersIcon } from "lucide-react";

export const LayersPanel = () => {
  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <LayersIcon size={18} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Layers</h3>
        </div>
      </div>
      
      {/* Layers Tree */}
      <div className="flex-1 overflow-auto p-2">
        <Layers expandRootOnLoad={true} />
      </div>
    </div>
  );
};