import type { CSSProperties } from "react";
import type { ResponsiveMap, ResponsiveResolver, ResponsiveValue } from "./types";
import { resolveResponsiveValue } from "./responsive";

interface BackgroundOptions {
  type?: string | null;
  color?: string | null;
  colorResponsive?: ResponsiveValue;
  gradient?: string;
  image?: string;
  resolver: ResponsiveResolver;
}

export const buildBackgroundStyles = ({ type, color, colorResponsive, gradient, image, resolver }: BackgroundOptions): CSSProperties => {
  if (!type) {
    return {};
  }

  switch (type) {
    case "color": {
      const resolvedColor = resolveResponsiveValue<string>({
        resolver,
        responsive: colorResponsive as ResponsiveMap<string>,
        fallback: color ?? "",
      });
      return resolvedColor ? { backgroundColor: resolvedColor } : {};
    }
    case "gradient":
      return gradient
        ? {
            background: gradient,
          }
        : {};
    case "image":
      return image
        ? {
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }
        : {};
    default:
      return {};
  }
};

interface OverlayOptions {
  enableOverlay?: boolean;
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
  resolver: ResponsiveResolver;
  className: string;
}

/**
 * Builds overlay CSS using pseudo-element (::before) for pure CSS overlays (eBay compatible)
 * Returns CSS string and inline styles object for editor preview
 */
export const buildOverlayStyles = ({
  enableOverlay,
  overlayType,
  overlayColor,
  overlayColorResponsive,
  overlayImage,
  overlayPosition,
  overlayPositionResponsive,
  overlayAttachment,
  overlayAttachmentResponsive,
  overlayBlendMode,
  overlayBlendModeResponsive,
  overlayRepeat,
  overlayRepeatResponsive,
  overlaySize,
  overlaySizeResponsive,
  overlayOpacity,
  overlayOpacityResponsive,
  resolver,
  className,
}: OverlayOptions): { css: string; style: CSSProperties } => {
  if (!enableOverlay || !overlayType) {
    return { css: "", style: {} };
  }

  const resolvedPosition = resolveResponsiveValue<string>({
    resolver,
    responsive: overlayPositionResponsive as ResponsiveMap<string>,
    fallback: overlayPosition ?? "center",
  });

  const resolvedAttachment = resolveResponsiveValue<string>({
    resolver,
    responsive: overlayAttachmentResponsive as ResponsiveMap<string>,
    fallback: overlayAttachment ?? "scroll",
  });

  const resolvedBlendMode = resolveResponsiveValue<string>({
    resolver,
    responsive: overlayBlendModeResponsive as ResponsiveMap<string>,
    fallback: overlayBlendMode ?? "normal",
  });

  const resolvedRepeat = resolveResponsiveValue<string>({
    resolver,
    responsive: overlayRepeatResponsive as ResponsiveMap<string>,
    fallback: overlayRepeat ?? "no-repeat",
  });

  const resolvedSize = resolveResponsiveValue<string>({
    resolver,
    responsive: overlaySizeResponsive as ResponsiveMap<string>,
    fallback: overlaySize ?? "cover",
  });

  const resolvedOpacity = resolveResponsiveValue<number>({
    resolver,
    responsive: overlayOpacityResponsive as ResponsiveMap<number>,
    fallback: overlayOpacity ?? 50,
  });

  let overlayBackground = "";
  if (overlayType === "color") {
    const resolvedColor = resolveResponsiveValue<string>({
      resolver,
      responsive: overlayColorResponsive as ResponsiveMap<string>,
      fallback: overlayColor ?? "rgba(0, 0, 0, 0.5)",
    });
    overlayBackground = resolvedColor || "rgba(0, 0, 0, 0.5)";
  } else if (overlayType === "image" && overlayImage) {
    overlayBackground = `url(${overlayImage})`;
  } else {
    return { css: "", style: {} };
  }

  // Convert opacity percentage to decimal (0-1)
  const opacityDecimal = resolvedOpacity / 100;

  // For editor preview, return inline styles with pseudo-element simulation
  // We'll render a div overlay in edit mode for visual feedback
  const style: CSSProperties = {
    position: "relative",
  };

  // Generate CSS for pseudo-element overlay (for export)
  // Using ::before pseudo-element for pure CSS overlay (eBay compatible - no JS)
  const css = `
    .${className}::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      ${overlayType === "color" ? `background-color: ${overlayBackground};` : `background-image: ${overlayBackground};`}
      ${overlayType === "image" ? `background-position: ${resolvedPosition};` : ""}
      ${overlayType === "image" ? `background-size: ${resolvedSize};` : ""}
      ${overlayType === "image" ? `background-repeat: ${resolvedRepeat};` : ""}
      ${overlayType === "image" ? `background-attachment: ${resolvedAttachment};` : ""}
      mix-blend-mode: ${resolvedBlendMode};
      opacity: ${opacityDecimal};
      pointer-events: none;
      z-index: 1;
    }
    .${className} > * {
      position: relative;
      z-index: 2;
    }
  `;

  return { css: css.trim(), style };
};

