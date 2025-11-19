"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { Text, Button, Container } from "../ui";

export const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <div className="w-64 bg-gray-100 p-4 border-r">
      <h3 className="font-semibold mb-4 text-gray-900">User Components</h3>
      <div className="space-y-2">
        <div
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <Text text="New Text" marginBottom={16} />);
            }
          }}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">📝 Text</span>
        </div>
        <div
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <Button text="New Button" />);
            }
          }}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">🔘 Button</span>
        </div>
        <div
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <Container showLayoutPicker={true} padding={10} />);
            }
          }}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">📦 Container</span>
        </div>
      </div>
    </div>
  );
};
