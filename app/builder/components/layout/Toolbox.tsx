"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { Text, Button, Heading, Image, Video, Icon, Container } from "../ui";

export const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <div className="w-64 bg-gray-100 p-4 border-r">
      <h3 className="font-semibold mb-4 text-gray-900">Components</h3>
      <div className="space-y-2">
        <div 
          ref={(ref) => connectors.create(ref, <Text text="New Text" />)}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">📝 Text</span>
        </div>
        <div 
          ref={(ref) => connectors.create(ref, <Button text="New Button" />)}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">🔘 Button</span>
        </div>
        <div 
          ref={(ref) => connectors.create(ref, <Heading text="New Heading" />)}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">🎨 Heading</span>
        </div>
        <div 
          ref={(ref) => connectors.create(ref, <Image />)}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">🖼️ Image</span>
        </div>
        <div 
          ref={(ref) => connectors.create(ref, <Video />)}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">🎥 Video</span>
        </div>
        <div 
          ref={(ref) => connectors.create(ref, <Icon />)}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">⭐ Icon</span>
        </div>
        <div 
          ref={(ref) => connectors.create(ref, <Container />)}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">📦 Container</span>
        </div>
        <div 
          ref={(ref) => connectors.create(ref, <Container layout="flex" flexDirection="row" justifyContent="center" />)}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">↔️ Flex Row</span>
        </div>
        <div 
          ref={(ref) => connectors.create(ref, <Container layout="flex" flexDirection="col" />)}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">↕️ Flex Column</span>
        </div>
        <div 
          ref={(ref) => connectors.create(ref, <Container layout="grid" gridCols={3} />)}
          className="p-3 bg-white border rounded cursor-grab hover:shadow-md"
        >
          <span className="text-gray-700">⊞ Grid</span>
        </div>
      </div>
    </div>
  );
};