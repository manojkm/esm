"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";

export const ContainerSettings = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props
  }));
  
  const [activeTab, setActiveTab] = useState("general");
  const [openAccordion, setOpenAccordion] = useState("containerType");

  const tabs = [
    { id: "general", label: "General", icon: "📐" },
    { id: "style", label: "Style", icon: "🎨" },
    { id: "advanced", label: "Advanced", icon: "⚙️" }
  ];

  const TabButton = ({ tab, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        isActive 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      <span>{tab.icon}</span>
      {tab.label}
    </button>
  );

  const AccordionSection = ({ id, title, isOpen, onToggle, children }) => (
    <div className="border border-gray-200 rounded-md">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {title}
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  const InputGroup = ({ label, children }) => (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );

  const ButtonGroup = ({ options, value, onChange, columns = 3 }) => (
    <div className={`grid grid-cols-${columns} gap-1`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-2 text-xs border rounded ${
            value === option.value
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const SliderInput = ({ value, onChange, min = 0, max = 2000, unit = "px" }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value || 0}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value || 0}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white"
          />
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
    </div>
  );

  const IconButton = ({ icon, isActive, onClick, tooltip }) => (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-2 border rounded ${
        isActive
          ? 'bg-blue-500 text-white border-blue-500'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-4">
          {/* Container Type Accordion */}
          <AccordionSection
            id="containerType"
            title="Container Type"
            isOpen={openAccordion === "containerType"}
            onToggle={(id) => setOpenAccordion(openAccordion === id ? "" : id)}
          >
            <InputGroup label="Container Width">
              <ButtonGroup
                options={[
                  { value: "full", label: "Full Width" },
                  { value: "boxed", label: "Boxed" },
                  { value: "custom", label: "Custom" }
                ]}
                value={props.containerWidth || "full"}
                onChange={(value) => actions.setProp((props) => props.containerWidth = value)}
              />
            </InputGroup>

            {props.containerWidth === "custom" && (
              <InputGroup label="Custom Width">
                <SliderInput
                  value={props.customWidth || 100}
                  onChange={(value) => actions.setProp((props) => props.customWidth = value)}
                  max={200}
                  unit="% VW"
                />
              </InputGroup>
            )}

            {props.containerWidth === "full" && (
              <>
                <InputGroup label="Content Width">
                  <ButtonGroup
                    options={[
                      { value: "boxed", label: "Boxed" },
                      { value: "full", label: "Full Width" }
                    ]}
                    value={props.contentWidth || "boxed"}
                    onChange={(value) => actions.setProp((props) => props.contentWidth = value)}
                    columns={2}
                  />
                </InputGroup>

                {props.contentWidth === "boxed" && (
                  <InputGroup label="Content Box Width">
                    <SliderInput
                      value={props.contentBoxWidth || 1400}
                      onChange={(value) => actions.setProp((props) => props.contentBoxWidth = value)}
                      max={2000}
                      unit="PX VW"
                    />
                  </InputGroup>
                )}
              </>
            )}

            <InputGroup label="Minimum Height">
              <SliderInput
                value={props.minHeight}
                onChange={(value) => actions.setProp((props) => props.minHeight = value)}
                max={1000}
              />
            </InputGroup>

            <InputGroup label="Equal Height">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.equalHeight || false}
                  onChange={(e) => actions.setProp((props) => props.equalHeight = e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs text-gray-600">
                  Enabling this will change the Align Items value to Stretch.
                </span>
              </div>
            </InputGroup>

            <InputGroup label="HTML Tag">
              <select 
                value={props.htmlTag || "div"}
                onChange={(e) => actions.setProp((props) => props.htmlTag = e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="div">Div</option>
                <option value="section">Section</option>
                <option value="article">Article</option>
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="main">Main</option>
              </select>
            </InputGroup>

            <InputGroup label="Overflow">
              <ButtonGroup
                options={[
                  { value: "visible", label: "Visible" },
                  { value: "hidden", label: "Hidden" },
                  { value: "auto", label: "Auto" }
                ]}
                value={props.overflow || "visible"}
                onChange={(value) => actions.setProp((props) => props.overflow = value)}
              />
            </InputGroup>
          </AccordionSection>

          {/* Layout Accordion */}
          <AccordionSection
            id="layout"
            title="Layout"
            isOpen={openAccordion === "layout"}
            onToggle={(id) => setOpenAccordion(openAccordion === id ? "" : id)}
          >
            <ButtonGroup
              options={[
                { value: "flex", label: "Flex" },
                { value: "grid", label: "Grid" }
              ]}
              value={props.layout || "flex"}
              onChange={(value) => actions.setProp((props) => props.layout = value)}
              columns={2}
            />

            {props.layout === "flex" && (
              <>
                <InputGroup label="Direction">
                  <div className="grid grid-cols-4 gap-1">
                    <IconButton
                      icon="↔"
                      isActive={props.flexDirection === "row"}
                      onClick={() => actions.setProp((props) => props.flexDirection = "row")}
                      tooltip="Row"
                    />
                    <IconButton
                      icon="↕"
                      isActive={props.flexDirection === "column"}
                      onClick={() => actions.setProp((props) => props.flexDirection = "column")}
                      tooltip="Column"
                    />
                    <IconButton
                      icon="↔"
                      isActive={props.flexDirection === "row-reverse"}
                      onClick={() => actions.setProp((props) => props.flexDirection = "row-reverse")}
                      tooltip="Row Reverse"
                    />
                    <IconButton
                      icon="↕"
                      isActive={props.flexDirection === "column-reverse"}
                      onClick={() => actions.setProp((props) => props.flexDirection = "column-reverse")}
                      tooltip="Column Reverse"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Define the direction in which blocks inside this container will be placed one after the other.</p>
                </InputGroup>

                <InputGroup label="Children Width">
                  <ButtonGroup
                    options={[
                      { value: "auto", label: "Auto" },
                      { value: "equal", label: "Equal" }
                    ]}
                    value={props.childrenWidth || "auto"}
                    onChange={(value) => actions.setProp((props) => props.childrenWidth = value)}
                    columns={2}
                  />
                </InputGroup>

                <InputGroup label="Align Items">
                  <div className="grid grid-cols-4 gap-1">
                    <IconButton
                      icon="⬆"
                      isActive={props.alignItems === "start"}
                      onClick={() => actions.setProp((props) => props.alignItems = "start")}
                      tooltip="Start"
                    />
                    <IconButton
                      icon="↕"
                      isActive={props.alignItems === "center"}
                      onClick={() => actions.setProp((props) => props.alignItems = "center")}
                      tooltip="Center"
                    />
                    <IconButton
                      icon="⬇"
                      isActive={props.alignItems === "end"}
                      onClick={() => actions.setProp((props) => props.alignItems = "end")}
                      tooltip="End"
                    />
                    <IconButton
                      icon="⬍"
                      isActive={props.alignItems === "stretch"}
                      onClick={() => actions.setProp((props) => props.alignItems = "stretch")}
                      tooltip="Stretch"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Define the vertical alignment inside this container.</p>
                </InputGroup>

                <InputGroup label="Justify Content">
                  <div className="grid grid-cols-6 gap-1">
                    <IconButton
                      icon="⬅"
                      isActive={props.justifyContent === "start"}
                      onClick={() => actions.setProp((props) => props.justifyContent = "start")}
                      tooltip="Start"
                    />
                    <IconButton
                      icon="↔"
                      isActive={props.justifyContent === "center"}
                      onClick={() => actions.setProp((props) => props.justifyContent = "center")}
                      tooltip="Center"
                    />
                    <IconButton
                      icon="➡"
                      isActive={props.justifyContent === "end"}
                      onClick={() => actions.setProp((props) => props.justifyContent = "end")}
                      tooltip="End"
                    />
                    <IconButton
                      icon="⬌"
                      isActive={props.justifyContent === "space-between"}
                      onClick={() => actions.setProp((props) => props.justifyContent = "space-between")}
                      tooltip="Space Between"
                    />
                    <IconButton
                      icon="⬌"
                      isActive={props.justifyContent === "space-around"}
                      onClick={() => actions.setProp((props) => props.justifyContent = "space-around")}
                      tooltip="Space Around"
                    />
                    <IconButton
                      icon="⬌"
                      isActive={props.justifyContent === "space-evenly"}
                      onClick={() => actions.setProp((props) => props.justifyContent = "space-evenly")}
                      tooltip="Space Evenly"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Define the horizontal alignment inside this container.</p>
                </InputGroup>

                <InputGroup label="Wrap">
                  <div className="grid grid-cols-3 gap-1">
                    <IconButton
                      icon="→"
                      isActive={props.flexWrap === "nowrap"}
                      onClick={() => actions.setProp((props) => props.flexWrap = "nowrap")}
                      tooltip="No Wrap"
                    />
                    <IconButton
                      icon="↩"
                      isActive={props.flexWrap === "wrap"}
                      onClick={() => actions.setProp((props) => props.flexWrap = "wrap")}
                      tooltip="Wrap"
                    />
                    <IconButton
                      icon="↪"
                      isActive={props.flexWrap === "wrap-reverse"}
                      onClick={() => actions.setProp((props) => props.flexWrap = "wrap-reverse")}
                      tooltip="Wrap Reverse"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Define whether the items are forced in a single line (No Wrap) or can be flowed into multiple lines (Wrap).</p>
                </InputGroup>
              </>
            )}
          </AccordionSection>
        </div>
      )}

      {/* Style Tab */}
      {activeTab === "style" && (
        <div className="space-y-4">
          <InputGroup label="Background Color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={props.backgroundColor || "#ffffff"}
                onChange={(e) => actions.setProp((props) => props.backgroundColor = e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={props.backgroundColor || "#ffffff"}
                onChange={(e) => actions.setProp((props) => props.backgroundColor = e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white"
              />
            </div>
          </InputGroup>

          <InputGroup label="Padding">
            <SliderInput
              value={props.padding}
              onChange={(value) => actions.setProp((props) => props.padding = value)}
              max={200}
            />
          </InputGroup>

          <InputGroup label="Margin">
            <SliderInput
              value={props.margin}
              onChange={(value) => actions.setProp((props) => props.margin = value)}
              max={200}
            />
          </InputGroup>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === "advanced" && (
        <div className="space-y-4">
          <InputGroup label="CSS Classes">
            <input
              type="text"
              value={props.cssClasses || ""}
              onChange={(e) => actions.setProp((props) => props.cssClasses = e.target.value)}
              placeholder="custom-class another-class"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded text-gray-900 bg-white"
            />
          </InputGroup>

          <InputGroup label="CSS ID">
            <input
              type="text"
              value={props.cssId || ""}
              onChange={(e) => actions.setProp((props) => props.cssId = e.target.value)}
              placeholder="unique-id"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded text-gray-900 bg-white"
            />
          </InputGroup>
        </div>
      )}
    </div>
  );
};