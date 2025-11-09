'use client';

import React from 'react';

export default function TestResponsiveFlex() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Responsive Flex Properties Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test 1: Responsive Justify Content</h2>
          <p className="text-gray-600 mb-4">Resize your browser to see justify content change:</p>
          
          {/* Desktop: space-between, Tablet: center, Mobile: flex-start */}
          <div className="flex justify-between md:justify-center sm:justify-start bg-blue-100 p-4 rounded">
            <div className="bg-blue-500 text-white px-4 py-2 rounded">Item 1</div>
            <div className="bg-blue-500 text-white px-4 py-2 rounded">Item 2</div>
            <div className="bg-blue-500 text-white px-4 py-2 rounded">Item 3</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test 2: Responsive Align Items</h2>
          <p className="text-gray-600 mb-4">Resize your browser to see align items change:</p>
          
          {/* Desktop: center, Tablet: flex-start, Mobile: stretch */}
          <div className="flex items-center md:items-start sm:items-stretch bg-green-100 p-4 rounded h-32">
            <div className="bg-green-500 text-white px-4 py-2 rounded">Item 1</div>
            <div className="bg-green-500 text-white px-4 py-6 rounded">Item 2 (taller)</div>
            <div className="bg-green-500 text-white px-4 py-2 rounded">Item 3</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test 3: Responsive Flex Wrap</h2>
          <p className="text-gray-600 mb-4">Resize your browser to see wrap behavior change:</p>
          
          {/* Desktop: nowrap, Tablet/Mobile: wrap */}
          <div className="flex flex-nowrap md:flex-wrap bg-purple-100 p-4 rounded">
            <div className="bg-purple-500 text-white px-8 py-2 m-1 rounded min-w-[120px]">Item 1</div>
            <div className="bg-purple-500 text-white px-8 py-2 m-1 rounded min-w-[120px]">Item 2</div>
            <div className="bg-purple-500 text-white px-8 py-2 m-1 rounded min-w-[120px]">Item 3</div>
            <div className="bg-purple-500 text-white px-8 py-2 m-1 rounded min-w-[120px]">Item 4</div>
            <div className="bg-purple-500 text-white px-8 py-2 m-1 rounded min-w-[120px]">Item 5</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">How to Test in Builder</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Open the builder at <a href="/builder" className="text-blue-600 hover:underline">/builder</a></li>
            <li>Add a Container component</li>
            <li>Set Layout to "flex"</li>
            <li>Add multiple child elements to the container</li>
            <li>In the settings panel, look for Justify Content, Align Items, and Wrap controls</li>
            <li>Click the responsive icon (📱) next to each control to set different values for different breakpoints</li>
            <li>Resize the preview or use device preview to see the responsive behavior</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Implementation Summary</h3>
          <p className="text-yellow-700">
            Responsive flex properties have been successfully implemented! The builder now supports:
          </p>
          <ul className="list-disc list-inside mt-2 text-yellow-700 space-y-1">
            <li>Responsive Justify Content (justifyContentResponsive)</li>
            <li>Responsive Align Items (alignItemsResponsive)</li>
            <li>Responsive Flex Wrap (flexWrapResponsive)</li>
            <li>Responsive Flex Direction (flexDirectionResponsive) - already existed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}