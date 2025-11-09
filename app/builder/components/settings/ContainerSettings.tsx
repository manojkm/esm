"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { ContainerGeneralSettings } from "./container/ContainerGeneralSettings";
import { ContainerStyleSettings } from "./container/ContainerStyleSettings";
import { ContainerAdvancedSettings } from "./container/ContainerAdvancedSettings";
import type { ContainerProps } from "../ui/container/types";
import type { ContainerControlActions } from "./shared/types";

const TABS = [
  { id: "general", label: "General" },
  { id: "style", label: "Style" },
  { id: "advanced", label: "Advanced" },
] as const;

export const ContainerSettings = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props as ContainerProps,
  }));

  const containerProps = props as ContainerProps;
  const containerActions = actions as ContainerControlActions;

  const [activeTab, setActiveTab] = useState<typeof TABS[number]["id"]>("general");

  /**
   * Render the shared three-tab settings shell (General / Style / Advanced).
   * Each tab delegates to feature-driven components that read from JSON config.
   */
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

      {activeTab === "general" && <ContainerGeneralSettings props={containerProps} actions={containerActions} />}

      {activeTab === "style" && <ContainerStyleSettings props={containerProps} actions={containerActions} />}

      {activeTab === "advanced" && <ContainerAdvancedSettings props={containerProps} actions={containerActions} />}
    </div>
  );
};


