"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { ContainerGeneralSettings } from "./container/ContainerGeneralSettings";
import { ContainerStyleSettings } from "./container/ContainerStyleSettings";
import { ContainerAdvancedSettings } from "./container/ContainerAdvancedSettings";

const TABS = [
  { id: "general", label: "General" },
  { id: "style", label: "Style" },
  { id: "advanced", label: "Advanced" },
] as const;

export const ContainerSettings = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props,
  }));

  const [activeTab, setActiveTab] = useState<typeof TABS[number]["id"]>("general");

  const isChildContainer = props.flexBasis !== null && props.flexBasis !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && <ContainerGeneralSettings props={props} actions={actions} isChildContainer={isChildContainer} />}

      {activeTab === "style" && <ContainerStyleSettings props={props} actions={actions} />}

      {activeTab === "advanced" && <ContainerAdvancedSettings props={props} actions={actions} />}
    </div>
  );
};


