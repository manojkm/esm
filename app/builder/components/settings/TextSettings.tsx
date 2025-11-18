"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { TextGeneralSettings } from "./text/TextGeneralSettings";
import { TextStyleSettings } from "./text/TextStyleSettings";
import { TextAdvancedSettings } from "./text/TextAdvancedSettings";
import type { TextProps } from "../ui/text/types";
import type { ComponentControlActions } from "./shared/types";

const TABS = [
  { id: "general", label: "General" },
  { id: "style", label: "Style" },
  { id: "advanced", label: "Advanced" },
] as const;

export const TextSettings = () => {
  const { id, actions, props } = useNode((node) => ({
    props: node.data.props as TextProps,
  }));

  const textProps = props as TextProps;
  const textActions = actions as ComponentControlActions<TextProps>;

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("general");

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

      {activeTab === "general" && <TextGeneralSettings props={textProps} actions={textActions} />}

      {activeTab === "style" && <TextStyleSettings props={textProps} actions={textActions} />}

      {activeTab === "advanced" && <TextAdvancedSettings props={textProps} actions={textActions} />}
    </div>
  );
};

