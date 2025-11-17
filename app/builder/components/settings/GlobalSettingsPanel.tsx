"use client";

import React, { useState } from "react";
import { useGlobalSettings } from "@/app/builder/contexts/GlobalSettingsContext";
import { ColorPicker } from "./shared/controls/ColorPicker";
import { X } from "lucide-react";

interface GlobalSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSettingsPanel: React.FC<GlobalSettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateColorPalette, updateTypography, updateSpacingScale, updateContainerDefaults, updateCustomCSS, resetSettings } = useGlobalSettings();
  const [activeSection, setActiveSection] = useState<"colors" | "typography" | "spacing" | "containers" | "css">("colors");

  if (!isOpen) return null;

  const colorKeys = ["primary", "secondary", "accent", "text", "background"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Global Settings</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveSection("colors")} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeSection === "colors" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
            Color Palette
          </button>
          <button onClick={() => setActiveSection("typography")} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeSection === "typography" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
            Typography
          </button>
          <button onClick={() => setActiveSection("spacing")} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeSection === "spacing" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
            Spacing Scale
          </button>
          <button onClick={() => setActiveSection("containers")} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeSection === "containers" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
            Container Defaults
          </button>
          <button onClick={() => setActiveSection("css")} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeSection === "css" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
            Custom CSS
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === "colors" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Theme Colors</h3>
                <p className="text-xs text-gray-500 mb-4">Define your brand colors. These will be available in all color pickers.</p>
                <div className="space-y-4">
                  {colorKeys.map((key) => (
                    <div key={key} className="flex items-center gap-4">
                      <label className="w-24 text-sm font-medium text-gray-700 capitalize">{key}</label>
                      <div className="flex-1 flex items-center gap-3">
                        <ColorPicker color={settings.colorPalette[key] || undefined} onChange={(color) => updateColorPalette({ [key]: color || undefined })} allowTransparent={false} />
                        <input type="text" value={settings.colorPalette[key] || ""} onChange={(e) => updateColorPalette({ [key]: e.target.value || undefined })} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="#000000" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "typography" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Font Families</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium text-gray-700">Headings</label>
                    <input type="text" value={settings.typography.fontFamily?.headings || ""} onChange={(e) => updateTypography({ fontFamily: { headings: e.target.value } })} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Arial, sans-serif" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium text-gray-700">Body</label>
                    <input type="text" value={settings.typography.fontFamily?.body || ""} onChange={(e) => updateTypography({ fontFamily: { body: e.target.value } })} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Arial, sans-serif" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Font Sizes (Desktop)</h3>
                <div className="space-y-3">
                  {(["h1", "h2", "h3", "h4", "h5", "h6", "body"] as const).map((element) => (
                    <div key={element} className="flex items-center gap-4">
                      <label className="w-16 text-sm font-medium text-gray-700 uppercase">{element}</label>
                      <input
                        type="number"
                        value={settings.typography.fontSize?.desktop?.[element] || ""}
                        onChange={(e) =>
                          updateTypography({
                            fontSize: {
                              desktop: {
                                ...settings.typography.fontSize?.desktop,
                                [element]: e.target.value ? parseInt(e.target.value) : undefined,
                              },
                            },
                          })
                        }
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="16"
                      />
                      <span className="text-xs text-gray-500">px</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Line Height</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium text-gray-700">Headings</label>
                    <input type="number" step="0.1" value={settings.typography.lineHeight?.headings || ""} onChange={(e) => updateTypography({ lineHeight: { headings: e.target.value ? parseFloat(e.target.value) : undefined } })} className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1.2" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium text-gray-700">Body</label>
                    <input type="number" step="0.1" value={settings.typography.lineHeight?.body || ""} onChange={(e) => updateTypography({ lineHeight: { body: e.target.value ? parseFloat(e.target.value) : undefined } })} className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1.6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "spacing" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Spacing Scale</h3>
                <p className="text-xs text-gray-500 mb-4">Define predefined spacing values that will be available for quick selection in spacing controls.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Unit</label>
                    <select value={settings.spacingScale.unit || "px"} onChange={(e) => updateSpacingScale({ unit: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="px">px</option>
                      <option value="rem">rem</option>
                      <option value="em">em</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spacing Values</label>
                    <p className="text-xs text-gray-500 mb-2">Enter comma-separated values (e.g., 4, 8, 12, 16, 20, 24, 32, 40, 48, 64)</p>
                    <input
                      type="text"
                      value={settings.spacingScale.values.join(", ")}
                      onChange={(e) => {
                        const values = e.target.value
                          .split(",")
                          .map((v) => parseInt(v.trim()))
                          .filter((v) => !isNaN(v) && v >= 0);
                        updateSpacingScale({ values });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="4, 8, 12, 16, 20, 24, 32, 40, 48, 64"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {settings.spacingScale.values.map((val) => (
                        <span key={val} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border border-gray-300">
                          {val}
                          {settings.spacingScale.unit || "px"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "containers" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Container Defaults</h3>
                <p className="text-xs text-gray-500 mb-4">Set default values for container max-widths, padding, and margins.</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Max Widths</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <label className="w-32 text-sm font-medium text-gray-700">Boxed</label>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="number"
                            value={settings.containerDefaults.maxWidth?.boxed || ""}
                            onChange={(e) =>
                              updateContainerDefaults({
                                maxWidth: {
                                  boxed: e.target.value ? parseInt(e.target.value) : undefined,
                                },
                              })
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1200"
                          />
                          <span className="text-xs text-gray-500">px</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-32 text-sm font-medium text-gray-700">Custom</label>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="number"
                            value={settings.containerDefaults.maxWidth?.custom || ""}
                            onChange={(e) =>
                              updateContainerDefaults({
                                maxWidth: {
                                  custom: e.target.value ? parseInt(e.target.value) : undefined,
                                },
                              })
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="100"
                          />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Default Spacing</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <label className="w-32 text-sm font-medium text-gray-700">Padding</label>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="number"
                            value={settings.containerDefaults.padding?.default || ""}
                            onChange={(e) =>
                              updateContainerDefaults({
                                padding: {
                                  default: e.target.value ? parseInt(e.target.value) : undefined,
                                },
                              })
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="10"
                          />
                          <span className="text-xs text-gray-500">px</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-32 text-sm font-medium text-gray-700">Margin</label>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="number"
                            value={settings.containerDefaults.margin?.default || ""}
                            onChange={(e) =>
                              updateContainerDefaults({
                                margin: {
                                  default: e.target.value ? parseInt(e.target.value) : undefined,
                                },
                              })
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-500">px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "css" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Custom CSS</h3>
                <p className="text-xs text-gray-500 mb-4">Add custom CSS that will be included in the exported HTML.</p>
                <textarea value={settings.customCSS} onChange={(e) => updateCustomCSS(e.target.value)} className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="/* Your custom CSS here */" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button onClick={resetSettings} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Reset to Defaults
          </button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
