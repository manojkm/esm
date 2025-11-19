"use client";

import React, { useEffect } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { ContainerGeneralSettings } from "./container/ContainerGeneralSettings";
import { ContainerStyleSettings } from "./container/ContainerStyleSettings";
import { ContainerAdvancedSettings } from "./container/ContainerAdvancedSettings";
import type { ContainerProps } from "../ui/container/types";
import type { ContainerControlActions } from "./shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import { usePersistedTabState } from "../../hooks/usePersistedTabState";

const TABS = [
  { id: "general", label: "General" },
  { id: "style", label: "Style" },
  { id: "advanced", label: "Advanced" },
] as const;

export const ContainerSettings = () => {
  const { id, actions, props } = useNode((node) => ({
    props: node.data.props as ContainerProps,
  }));

  const { query, actions: editorActions } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const containerProps = props as ContainerProps;
  const containerActions = actions as ContainerControlActions;

  const [activeTab, setActiveTab] = usePersistedTabState<(typeof TABS)[number]["id"]>("Container", "general");

  // Initialize flexDirectionResponsive for parent containers with mobile default to "column"
  // This runs whenever a container is selected, regardless of which tab/accordion is open
  // Follows the same pattern as containerParentSizing and containerChildSizing
  useEffect(() => {
    const isChildContainer = containerProps.flexBasis !== null && containerProps.flexBasis !== undefined;
    const layoutValue = containerProps.layout || (isChildContainer ? "flex" : "block");

    // Only initialize for parent containers (not child containers) with flex layout
    if (isChildContainer || layoutValue !== "flex") return;

    const responsive = containerProps.flexDirectionResponsive;
    const needsDesktop = !responsive || responsive.desktop === undefined;
    const needsTablet = !responsive || responsive.tablet === undefined;
    const needsMobile = !responsive || responsive.mobile === undefined;

    if (!(needsDesktop || needsTablet || needsMobile)) {
      return;
    }

    containerActions.setProp((draft) => {
      const nextResponsive: ResponsiveValue = { ...(draft.flexDirectionResponsive as ResponsiveValue | undefined) };
      const fallback = draft.flexDirection ?? "row";
      nextResponsive.desktop ??= fallback;
      nextResponsive.tablet ??= fallback;
      nextResponsive.mobile ??= "column";
      draft.flexDirectionResponsive = nextResponsive;
    });
  }, [containerActions, containerProps.flexBasis, containerProps.layout, containerProps.flexDirectionResponsive, containerProps.flexDirection]);

  // Update child containers' mobile width to 100% when parent flexDirection is "column" on mobile
  // This runs whenever parent's flexDirection changes, ensuring child containers automatically adjust
  useEffect(() => {
    const isChildContainer = containerProps.flexBasis !== null && containerProps.flexBasis !== undefined;
    const layoutValue = containerProps.layout || (isChildContainer ? "flex" : "block");

    // Only run for parent containers (not child containers) with flex layout
    if (isChildContainer || layoutValue !== "flex") return;

    // Get parent's mobile flexDirection
    const flexDirectionResponsive = containerProps.flexDirectionResponsive;
    const flexDirection = containerProps.flexDirection;
    const mobileFlexDirection = (flexDirectionResponsive?.mobile as string | undefined) ?? flexDirection ?? "row";
    const isColumnOnMobile = mobileFlexDirection === "column";

    if (!isColumnOnMobile) return;

    // Get all child nodes and update their mobile width to 100%
    try {
      const currentNode = query.node(id).get();
      const childNodeIds = currentNode.data.nodes || [];

      childNodeIds.forEach((childId: string) => {
        try {
          const childNode = query.node(childId).get();
          const childProps = childNode.data.props as ContainerProps;

          // Only update if it's a child container (has flexBasis)
          if (childProps.flexBasis !== null && childProps.flexBasis !== undefined) {
            const childResponsive = childProps.flexBasisResponsive;
            const needsMobileValue = !childResponsive || childResponsive.mobile === undefined;
            const needsMobileUnit = !childResponsive?.unit || childResponsive.unit.mobile === undefined;

            if (needsMobileValue || needsMobileUnit) {
              editorActions.setProp(childId, (draft: ContainerProps) => {
                const nextResponsive: ResponsiveValue = { ...(draft.flexBasisResponsive as ResponsiveValue | undefined) };
                const fallback = draft.flexBasis ?? (draft.flexBasisUnit === "px" ? 320 : 100);

                // Initialize all breakpoints if responsive object doesn't exist
                if (!nextResponsive.desktop) {
                  nextResponsive.desktop = fallback;
                }
                if (!nextResponsive.tablet) {
                  nextResponsive.tablet = fallback;
                }
                // Set mobile to 100% when parent is column on mobile
                if (needsMobileValue) {
                  nextResponsive.mobile = 100;
                }

                // Initialize unit object if needed
                if (!nextResponsive.unit) {
                  nextResponsive.unit = {};
                }
                if (!nextResponsive.unit.desktop) {
                  nextResponsive.unit.desktop = draft.flexBasisUnit ?? "%";
                }
                if (!nextResponsive.unit.tablet) {
                  nextResponsive.unit.tablet = draft.flexBasisUnit ?? "%";
                }
                if (needsMobileUnit) {
                  nextResponsive.unit.mobile = "%";
                }

                draft.flexBasisResponsive = nextResponsive;
              });
            }
          }
        } catch {
          // Skip if we can't update this child
        }
      });
    } catch {
      // Skip if we can't access children
    }
  }, [id, query, editorActions, containerProps.flexBasis, containerProps.layout, containerProps.flexDirectionResponsive, containerProps.flexDirection]);

  /**
   * Render the shared three-tab settings shell (General / Style / Advanced).
   * Each tab delegates to feature-driven components that read from JSON config.
   */
  return (
    <div className="space-y-4">
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
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
