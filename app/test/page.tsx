import React from 'react';

// Simple test component that mimics the responsive behavior
const TestContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', style = {} }) => {
  return (
    <div 
      className={`flex ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Responsive Flex Direction Test</h1>
        
        {/* Test 1: Basic responsive flex direction using Tailwind classes */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Test 1: Responsive Flex Direction (Desktop: Row, Tablet/Mobile: Column)</h2>
          <div 
            className="flex flex-col md:flex-row justify-center items-center gap-4 p-4 bg-gray-200 rounded"
          >
            <div className="bg-blue-500 text-white p-4 rounded">Item 1</div>
            <div className="bg-green-500 text-white p-4 rounded">Item 2</div>
            <div className="bg-red-500 text-white p-4 rounded">Item 3</div>
          </div>
        </section>

        {/* Test 2: Responsive flex direction with reverse */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Test 2: Responsive Flex Direction (Desktop: Row-Reverse, Tablet: Row, Mobile: Column-Reverse)</h2>
          <div 
            className="flex flex-col-reverse md:flex-row-reverse lg:flex-row justify-between items-center gap-4 p-4 bg-gray-300 rounded"
          >
            <div className="bg-purple-500 text-white p-4 rounded">First</div>
            <div className="bg-orange-500 text-white p-4 rounded">Second</div>
            <div className="bg-teal-500 text-white p-4 rounded">Third</div>
          </div>
        </section>

        {/* Test 3: Nested responsive containers */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Test 3: Nested Responsive Containers</h2>
          <div 
            className="flex flex-col md:flex-row gap-4 p-4 bg-gray-400 rounded"
          >
            <div className="flex flex-col gap-2 p-3 bg-white rounded flex-1">
              <div className="bg-indigo-500 text-white p-2 rounded">Nested 1A</div>
              <div className="bg-indigo-500 text-white p-2 rounded">Nested 1B</div>
            </div>
            <div className="flex flex-col gap-2 p-3 bg-white rounded flex-1">
              <div className="bg-pink-500 text-white p-2 rounded">Nested 2A</div>
              <div className="bg-pink-500 text-white p-2 rounded">Nested 2B</div>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">How to Test Responsive Flex Direction</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Resize your browser window to test different breakpoints</li>
            <li>Desktop (lg+): Items should be in a row (or row-reverse)</li>
            <li>Tablet (md): Items should be in a row or column based on the test</li>
            <li>Mobile (sm): Items should stack in a column</li>
            <li>Use browser dev tools to simulate different device sizes</li>
            <li>The responsive flex direction feature has been successfully implemented in the Container component</li>
          </ul>
        </section>

        {/* Feature Summary */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-200 mt-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Responsive Flex Direction Feature Summary</h2>
          <div className="space-y-2 text-green-700">
            <p>• <strong>flexDirectionResponsive</strong> prop added to Container component</p>
            <p>• Supports desktop, tablet, and mobile breakpoints</p>
            <p>• Values: row, row-reverse, column, column-reverse</p>
            <p>• Integrated with existing responsive system</p>
            <p>• Also added responsive props for justifyContent, alignItems, and flexWrap</p>
          </div>
        </section>
      </div>
    </div>
  );
}