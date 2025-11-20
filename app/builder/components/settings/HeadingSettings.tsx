"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { HeadingGeneralSettings } from "./heading/HeadingGeneralSettings";
import { HeadingStyleSettings } from "./heading/HeadingStyleSettings";
import { HeadingAdvancedSettings } from "./heading/HeadingAdvancedSettings";
import type { HeadingProps } from "../ui/heading/types";
import type { ComponentControlActions } from "./shared/types";
import { usePersistedTabState } from "../../hooks/usePersistedTabState";

const TABS = [
  { id: "general", label: "General" },
  { id: "style", label: "Style" },
  { id: "advanced", label: "Advanced" },
] as const;

export const HeadingSettings = () => {
  const { id, actions, props } = useNode((node) => ({
    props: node.data.props as HeadingProps,
  }));

  const headingProps = props as HeadingProps;
  const headingActions = actions as ComponentControlActions<HeadingProps>;

  const [activeTab, setActiveTab] = usePersistedTabState<(typeof TABS)[number]["id"]>("Heading", "general");

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

      {activeTab === "general" && <HeadingGeneralSettings props={headingProps} actions={headingActions} />}

      {activeTab === "style" && <HeadingStyleSettings props={headingProps} actions={headingActions} />}

      {activeTab === "advanced" && <HeadingAdvancedSettings props={headingProps} actions={headingActions} />}
    </div>
  );
};

