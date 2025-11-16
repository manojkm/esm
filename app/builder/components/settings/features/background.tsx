"use client";

import React from "react";
import { INLINE_FIELD_CLASS, INLINE_LABEL_CLASS, INLINE_ROW_CLASS } from "../shared/styles";
import { ColorInput, ResponsiveSelectControl, ResponsiveNumberInput } from "../shared/controls";
import type { ComponentControlActions } from "../shared/types";
import type { ResponsiveValue } from "@/app/builder/lib/style-system";
import type { ResponsiveRecord } from "../shared/types/responsive";

/**
 * Provides background type selection alongside responsive color/gradient/image inputs.
 * Shared across components that offer background customization.
 */

export interface BackgroundFeatureProps {
  backgroundType?: string | null;
  backgroundColor?: string;
  enableBackgroundColorHover?: boolean;
  backgroundColorHover?: string | null;
  backgroundColorResponsive?: ResponsiveValue;
  backgroundColorHoverResponsive?: ResponsiveValue;
  backgroundGradient?: string;
  backgroundGradientHover?: string;
  backgroundImage?: string;
  // Background Overlay
  enableBackgroundOverlay?: boolean;
  overlayType?: string | null;
  overlayColor?: string | null;
  overlayColorResponsive?: ResponsiveValue;
  overlayImage?: string;
  overlayPosition?: string;
  overlayPositionResponsive?: ResponsiveValue;
  overlayAttachment?: string;
  overlayAttachmentResponsive?: ResponsiveValue;
  overlayBlendMode?: string;
  overlayBlendModeResponsive?: ResponsiveValue;
  overlayRepeat?: string;
  overlayRepeatResponsive?: ResponsiveValue;
  overlaySize?: string;
  overlaySizeResponsive?: ResponsiveValue;
  overlayOpacity?: number;
  overlayOpacityResponsive?: ResponsiveValue;
}

export interface BackgroundControlsProps<TProps extends BackgroundFeatureProps> {
  props: TProps;
  actions: ComponentControlActions<TProps>;
  controlId?: string;
}

const BackgroundTypeControl = <TProps extends BackgroundFeatureProps>({ props, actions, controlId = "background-type" }: BackgroundControlsProps<TProps>) => {
  const baseId = `background-type-${controlId}`;
  const options = ["color", "gradient", "image"];

  return (
    <section id={baseId} data-component-id={baseId}>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`${baseId}-buttons`}>
        Background Type
      </label>
      <div id={`${baseId}-buttons`} className="grid grid-cols-3 gap-1">
        {options.map((type) => {
          const isActive = props.backgroundType === type;
          return (
            <button
              key={type}
              type="button"
              data-component-id={`${baseId}-${type}`}
              onClick={() =>
                actions.setProp((draft) => {
                  draft.backgroundType = isActive ? null : type;
                })
              }
              className={`px-3 py-2 text-xs border rounded capitalize transition-colors ${isActive ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
              aria-pressed={isActive}
            >
              {type}
            </button>
          );
        })}
      </div>
    </section>
  );
};

const BackgroundColorControls = <TProps extends BackgroundFeatureProps>({ props, actions, controlId = "background-color" }: BackgroundControlsProps<TProps>) => {
  if (props.backgroundType !== "color") return null;

  const baseId = `background-color-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <ColorInput
        label="Background Color"
        value={props.backgroundColorResponsive as ResponsiveRecord | undefined}
        onChange={(value) =>
          actions.setProp((draft) => {
            draft.backgroundColorResponsive = value as ResponsiveValue;
          })
        }
        placeholder="#ffffff"
        responsive
      />

      {/* Hover Color Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Hover Background Color</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id={`${baseId}-hover-toggle`}
            type="checkbox"
            checked={props.enableBackgroundColorHover || false}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.enableBackgroundColorHover = event.target.checked;
                if (!event.target.checked) {
                  draft.backgroundColorHover = null;
                  draft.backgroundColorHoverResponsive = undefined;
                }
                // When enabled, don't initialize with any default value - let user choose
              })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {props.enableBackgroundColorHover && (
        <ColorInput
          label="Hover Color"
          value={props.backgroundColorHoverResponsive as ResponsiveRecord | undefined}
          onChange={(value) =>
            actions.setProp((draft) => {
              draft.backgroundColorHoverResponsive = value as ResponsiveValue;
              const record = value as ResponsiveRecord;
              const fallback = (record.desktop as string | undefined) ?? draft.backgroundColorHover ?? null;
              draft.backgroundColorHover = fallback;
            })
          }
          placeholder="#000000"
          responsive
        />
      )}
    </section>
  );
};

const BackgroundGradientControls = <TProps extends BackgroundFeatureProps>({ props, actions, controlId = "background-gradient" }: BackgroundControlsProps<TProps>) => {
  if (props.backgroundType !== "gradient") return null;

  const baseId = `background-gradient-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-gradient`}>
          Gradient
        </label>
        <input
          id={`${baseId}-gradient`}
          type="text"
          value={props.backgroundGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.backgroundGradient = event.target.value;
            })
          }
          className={INLINE_FIELD_CLASS}
          placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
      </div>
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-hover-gradient`}>
          Hover Gradient
        </label>
        <input
          id={`${baseId}-hover-gradient`}
          type="text"
          value={props.backgroundGradientHover || "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.backgroundGradientHover = event.target.value;
            })
          }
          className={INLINE_FIELD_CLASS}
          placeholder="linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
        />
      </div>
    </section>
  );
};

const BackgroundImageControls = <TProps extends BackgroundFeatureProps>({ props, actions, controlId = "background-image" }: BackgroundControlsProps<TProps>) => {
  if (props.backgroundType !== "image") return null;

  const baseId = `background-image-controls-${controlId}`;

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3">
      <div className={INLINE_ROW_CLASS}>
        <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-image`}>
          Image URL
        </label>
        <input
          id={`${baseId}-image`}
          type="text"
          value={props.backgroundImage || ""}
          onChange={(event) =>
            actions.setProp((draft) => {
              draft.backgroundImage = event.target.value;
            })
          }
          className={INLINE_FIELD_CLASS}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </section>
  );
};

const BackgroundOverlayControls = <TProps extends BackgroundFeatureProps>({ props, actions, controlId = "background-overlay" }: BackgroundControlsProps<TProps>) => {
  const baseId = `background-overlay-controls-${controlId}`;

  const overlayPositionOptions = [
    { value: "center", label: "Center" },
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
    { value: "top left", label: "Top Left" },
    { value: "top right", label: "Top Right" },
    { value: "bottom left", label: "Bottom Left" },
    { value: "bottom right", label: "Bottom Right" },
  ];

  const overlayAttachmentOptions = [
    { value: "scroll", label: "Scroll" },
    { value: "fixed", label: "Fixed" },
  ];

  const overlayBlendModeOptions = [
    { value: "normal", label: "Normal" },
    { value: "multiply", label: "Multiply" },
    { value: "screen", label: "Screen" },
    { value: "overlay", label: "Overlay" },
    { value: "darken", label: "Darken" },
    { value: "lighten", label: "Lighten" },
    { value: "color-dodge", label: "Color Dodge" },
    { value: "color-burn", label: "Color Burn" },
    { value: "hard-light", label: "Hard Light" },
    { value: "soft-light", label: "Soft Light" },
    { value: "difference", label: "Difference" },
    { value: "exclusion", label: "Exclusion" },
  ];

  const overlayRepeatOptions = [
    { value: "no-repeat", label: "No Repeat" },
    { value: "repeat", label: "Repeat" },
    { value: "repeat-x", label: "Repeat X" },
    { value: "repeat-y", label: "Repeat Y" },
  ];

  const overlaySizeOptions = [
    { value: "cover", label: "Cover" },
    { value: "contain", label: "Contain" },
    { value: "auto", label: "Auto" },
    { value: "100% 100%", label: "100% 100%" },
  ];

  return (
    <section id={baseId} data-component-id={baseId} className="space-y-3 border-t pt-4 mt-4">
      {/* Enable Overlay Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Background Overlay</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id={`${baseId}-toggle`}
            type="checkbox"
            checked={props.enableBackgroundOverlay || false}
            onChange={(event) =>
              actions.setProp((draft) => {
                draft.enableBackgroundOverlay = event.target.checked;
                if (!event.target.checked) {
                  draft.overlayType = null;
                  draft.overlayColor = null;
                  draft.overlayImage = undefined;
                  draft.overlayColorResponsive = undefined;
                } else if (!draft.overlayType) {
                  draft.overlayType = "color";
                }
              })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {props.enableBackgroundOverlay && (
        <>
          {/* Type */}
          <div className={INLINE_ROW_CLASS}>
            <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-type`}>
              Type
            </label>
            <div className="grid grid-cols-2 gap-1">
              {["color", "image"].map((type) => {
                const isActive = props.overlayType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      actions.setProp((draft) => {
                        draft.overlayType = isActive ? null : type;
                      })
                    }
                    className={`px-3 py-2 text-xs border rounded capitalize transition-colors ${isActive ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          {props.overlayType === "color" && (
            <ColorInput
              label="Color"
              value={props.overlayColorResponsive as ResponsiveRecord | undefined}
              onChange={(value) =>
                actions.setProp((draft) => {
                  draft.overlayColorResponsive = value as ResponsiveValue;
                  const record = value as ResponsiveRecord;
                  const fallback = (record.desktop as string | undefined) ?? draft.overlayColor ?? null;
                  draft.overlayColor = fallback;
                })
              }
              placeholder="#000000"
              responsive
            />
          )}

          {/* Image */}
          {props.overlayType === "image" && (
            <div className={INLINE_ROW_CLASS}>
              <label className={INLINE_LABEL_CLASS} htmlFor={`${baseId}-overlay-image`}>
                Image URL
              </label>
              <input
                id={`${baseId}-overlay-image`}
                type="text"
                value={props.overlayImage || ""}
                onChange={(event) =>
                  actions.setProp((draft) => {
                    draft.overlayImage = event.target.value;
                  })
                }
                className={INLINE_FIELD_CLASS}
                placeholder="https://example.com/overlay.png"
              />
            </div>
          )}

          {/* Position */}
          {props.overlayType && (
            <ResponsiveSelectControl
              controlId={`${baseId}-position`}
              label="Position"
              variant="inline"
              value={props.overlayPositionResponsive as ResponsiveRecord | undefined}
              onChange={(value) =>
                actions.setProp((draft) => {
                  draft.overlayPositionResponsive = value as ResponsiveValue;
                  const record = value as ResponsiveRecord;
                  const fallback = (record.desktop as string | undefined) ?? draft.overlayPosition ?? "center";
                  draft.overlayPosition = fallback;
                })
              }
              options={overlayPositionOptions}
              defaultValue="center"
              layout="select"
            />
          )}

          {/* Size - only for image overlays */}
          {props.overlayType === "image" && (
            <ResponsiveSelectControl
              controlId={`${baseId}-size`}
              label="Size"
              variant="inline"
              value={props.overlaySizeResponsive as ResponsiveRecord | undefined}
              onChange={(value) =>
                actions.setProp((draft) => {
                  draft.overlaySizeResponsive = value as ResponsiveValue;
                  const record = value as ResponsiveRecord;
                  const fallback = (record.desktop as string | undefined) ?? draft.overlaySize ?? "cover";
                  draft.overlaySize = fallback;
                })
              }
              options={overlaySizeOptions}
              defaultValue="cover"
              layout="select"
            />
          )}

          {/* Repeat - only for image overlays */}
          {props.overlayType === "image" && (
            <ResponsiveSelectControl
              controlId={`${baseId}-repeat`}
              label="Repeat"
              variant="inline"
              value={props.overlayRepeatResponsive as ResponsiveRecord | undefined}
              onChange={(value) =>
                actions.setProp((draft) => {
                  draft.overlayRepeatResponsive = value as ResponsiveValue;
                  const record = value as ResponsiveRecord;
                  const fallback = (record.desktop as string | undefined) ?? draft.overlayRepeat ?? "no-repeat";
                  draft.overlayRepeat = fallback;
                })
              }
              options={overlayRepeatOptions}
              defaultValue="no-repeat"
              layout="select"
            />
          )}

          {/* Attachment */}
          {props.overlayType === "image" && (
            <ResponsiveSelectControl
              controlId={`${baseId}-attachment`}
              label="Attachment"
              variant="inline"
              value={props.overlayAttachmentResponsive as ResponsiveRecord | undefined}
              onChange={(value) =>
                actions.setProp((draft) => {
                  draft.overlayAttachmentResponsive = value as ResponsiveValue;
                  const record = value as ResponsiveRecord;
                  const fallback = (record.desktop as string | undefined) ?? draft.overlayAttachment ?? "scroll";
                  draft.overlayAttachment = fallback;
                })
              }
              options={overlayAttachmentOptions}
              defaultValue="scroll"
              layout="select"
            />
          )}

          {/* Blend Mode */}
          {props.overlayType && (
            <ResponsiveSelectControl
              controlId={`${baseId}-blend-mode`}
              label="Blend Mode"
              variant="inline"
              value={props.overlayBlendModeResponsive as ResponsiveRecord | undefined}
              onChange={(value) =>
                actions.setProp((draft) => {
                  draft.overlayBlendModeResponsive = value as ResponsiveValue;
                  const record = value as ResponsiveRecord;
                  const fallback = (record.desktop as string | undefined) ?? draft.overlayBlendMode ?? "normal";
                  draft.overlayBlendMode = fallback;
                })
              }
              options={overlayBlendModeOptions}
              defaultValue="normal"
              layout="select"
            />
          )}

          {/* Opacity */}
          {props.overlayType && (
            <ResponsiveNumberInput
              controlId={`${baseId}-opacity`}
              label="Opacity"
              value={props.overlayOpacityResponsive as ResponsiveRecord | undefined}
              onChange={(value) =>
                actions.setProp((draft) => {
                  draft.overlayOpacityResponsive = value as ResponsiveValue;
                  const record = value as ResponsiveRecord;
                  const fallback = (record.desktop as number | undefined) ?? draft.overlayOpacity ?? 1;
                  draft.overlayOpacity = fallback;
                })
              }
              min={0}
              max={100}
              unit="%"
              unitOptions={["%"]}
              defaultValue={50}
            />
          )}
        </>
      )}
    </section>
  );
};

export const BackgroundControls = <TProps extends BackgroundFeatureProps>({ props, actions, controlId = "background" }: BackgroundControlsProps<TProps>) => {
  const baseId = `background-controls-${controlId}`;

  return (
    <div id={baseId} data-component-id={baseId} className="space-y-4">
      <BackgroundTypeControl props={props} actions={actions} controlId={`${controlId}-type`} />
      <BackgroundColorControls props={props} actions={actions} controlId={`${controlId}-color`} />
      <BackgroundGradientControls props={props} actions={actions} controlId={`${controlId}-gradient`} />
      <BackgroundImageControls props={props} actions={actions} controlId={`${controlId}-image`} />
      <BackgroundOverlayControls props={props} actions={actions} controlId={`${controlId}-overlay`} />
    </div>
  );
};
