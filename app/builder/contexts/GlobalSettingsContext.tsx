"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ColorPalette {
  primary?: string;
  secondary?: string;
  accent?: string;
  text?: string;
  background?: string;
  [key: string]: string | undefined; // Allow custom color keys
}

export interface GoogleFont {
  family: string; // Font family name (e.g., "Roboto", "Open Sans")
  weights?: string[]; // Available weights (e.g., ["300", "400", "500", "700"])
  styles?: string[]; // Available styles (e.g., ["normal", "italic"])
}

export interface TypographySettings {
  // Google Fonts
  googleFonts?: {
    headings?: GoogleFont;
    body?: GoogleFont;
  };
  // Fallback font families (used if Google Font not set)
  fontFamily?: {
    headings?: string;
    body?: string;
  };
  // Responsive font sizes
  fontSize?: {
    desktop?: {
      h1?: number;
      h2?: number;
      h3?: number;
      h4?: number;
      h5?: number;
      h6?: number;
      body?: number;
    };
    tablet?: {
      h1?: number;
      h2?: number;
      h3?: number;
      h4?: number;
      h5?: number;
      h6?: number;
      body?: number;
    };
    mobile?: {
      h1?: number;
      h2?: number;
      h3?: number;
      h4?: number;
      h5?: number;
      h6?: number;
      body?: number;
    };
  };
  // Font weights
  fontWeight?: {
    headings?: number | string; // e.g., 400, 500, 700 or "normal", "bold"
    body?: number | string;
  };
  // Font styles
  fontStyle?: {
    headings?: "normal" | "italic" | "oblique";
    body?: "normal" | "italic" | "oblique";
  };
  // Text colors
  textColor?: {
    headings?: string;
    body?: string;
  };
  // Line height
  lineHeight?: {
    headings?: number;
    body?: number;
  };
  // Letter spacing
  letterSpacing?: {
    headings?: number;
    body?: number;
  };
  // Paragraph spacing (margin-bottom)
  paragraphSpacing?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  };
}

export interface SpacingScale {
  values: number[]; // Array of predefined spacing values (e.g., [4, 8, 12, 16, 20, 24, 32, 40, 48, 64])
  unit?: string; // Default unit (px, rem, etc.)
}

export interface ContainerDefaults {
  maxWidth?: {
    boxed?: number;
    custom?: number;
  };
  padding?: {
    default?: number;
  };
  margin?: {
    default?: number;
  };
}

export interface GlobalSettings {
  colorPalette: ColorPalette;
  typography: TypographySettings;
  spacingScale: SpacingScale;
  containerDefaults: ContainerDefaults;
  customCSS: string;
}

const defaultGlobalSettings: GlobalSettings = {
  colorPalette: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#10b981",
    text: "#1f2937",
    background: "#ffffff",
  },
  typography: {
    googleFonts: {
      headings: undefined,
      body: undefined,
    },
    fontFamily: {
      headings: "Arial, sans-serif",
      body: "Arial, sans-serif",
    },
    fontSize: {
      desktop: {
        h1: 48,
        h2: 36,
        h3: 30,
        h4: 24,
        h5: 20,
        h6: 18,
        body: 16,
      },
      tablet: {
        h1: 40,
        h2: 32,
        h3: 26,
        h4: 22,
        h5: 18,
        h6: 16,
        body: 16,
      },
      mobile: {
        h1: 32,
        h2: 28,
        h3: 24,
        h4: 20,
        h5: 18,
        h6: 16,
        body: 16,
      },
    },
    fontWeight: {
      headings: 700,
      body: 400,
    },
    fontStyle: {
      headings: "normal",
      body: "normal",
    },
    textColor: {
      headings: "#1f2937",
      body: "#1f2937",
    },
    lineHeight: {
      headings: 1.2,
      body: 1.6,
    },
    letterSpacing: {
      headings: 0,
      body: 0,
    },
    paragraphSpacing: {
      desktop: 16,
      tablet: 14,
      mobile: 12,
    },
  },
  spacingScale: {
    values: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
    unit: "px",
  },
  containerDefaults: {
    maxWidth: {
      boxed: 1200,
      custom: 100,
    },
    padding: {
      default: 10,
    },
    margin: {
      default: 0,
    },
  },
  customCSS: "",
};

interface GlobalSettingsContextType {
  settings: GlobalSettings;
  updateColorPalette: (palette: Partial<ColorPalette>) => void;
  updateTypography: (typography: Partial<TypographySettings>) => void;
  updateSpacingScale: (scale: Partial<SpacingScale>) => void;
  updateContainerDefaults: (defaults: Partial<ContainerDefaults>) => void;
  updateCustomCSS: (css: string) => void;
  resetSettings: () => void;
  getColor: (key: string) => string | undefined;
  getTypography: (type: "headings" | "body", property: "fontFamily" | "fontSize" | "lineHeight" | "letterSpacing", breakpoint?: "desktop" | "tablet" | "mobile", element?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body") => string | number | undefined;
  getSpacingScale: () => SpacingScale;
  getContainerDefaults: () => ContainerDefaults;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextType | undefined>(undefined);

export const GlobalSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GlobalSettings>(() => {
    // Try to load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ebay-builder-global-settings");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...defaultGlobalSettings, ...parsed };
        } catch {
          return defaultGlobalSettings;
        }
      }
    }
    return defaultGlobalSettings;
  });

  // Save to localStorage whenever settings change
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ebay-builder-global-settings", JSON.stringify(settings));
    }
  }, [settings]);

  const updateColorPalette = useCallback((palette: Partial<ColorPalette>) => {
    setSettings((prev) => ({
      ...prev,
      colorPalette: { ...prev.colorPalette, ...palette },
    }));
  }, []);

  const updateTypography = useCallback((typography: Partial<TypographySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev.typography };
      
      if (typography.googleFonts !== undefined) {
        updated.googleFonts = { ...prev.typography.googleFonts, ...typography.googleFonts };
      }
      
      if (typography.fontFamily) {
        updated.fontFamily = { ...prev.typography.fontFamily, ...typography.fontFamily };
      }
      
      if (typography.fontSize) {
        updated.fontSize = {
          desktop: { ...prev.typography.fontSize?.desktop, ...typography.fontSize.desktop },
          tablet: { ...prev.typography.fontSize?.tablet, ...typography.fontSize.tablet },
          mobile: { ...prev.typography.fontSize?.mobile, ...typography.fontSize.mobile },
        };
      }
      
      if (typography.fontWeight) {
        updated.fontWeight = { ...prev.typography.fontWeight, ...typography.fontWeight };
      }
      
      if (typography.fontStyle) {
        updated.fontStyle = { ...prev.typography.fontStyle, ...typography.fontStyle };
      }
      
      if (typography.textColor) {
        updated.textColor = { ...prev.typography.textColor, ...typography.textColor };
      }
      
      if (typography.lineHeight) {
        updated.lineHeight = { ...prev.typography.lineHeight, ...typography.lineHeight };
      }
      
      if (typography.letterSpacing) {
        updated.letterSpacing = { ...prev.typography.letterSpacing, ...typography.letterSpacing };
      }
      
      if (typography.paragraphSpacing) {
        updated.paragraphSpacing = { ...prev.typography.paragraphSpacing, ...typography.paragraphSpacing };
      }
      
      return {
        ...prev,
        typography: updated,
      };
    });
  }, []);

  const updateSpacingScale = useCallback((scale: Partial<SpacingScale>) => {
    setSettings((prev) => ({
      ...prev,
      spacingScale: { ...prev.spacingScale, ...scale },
    }));
  }, []);

  const updateContainerDefaults = useCallback((defaults: Partial<ContainerDefaults>) => {
    setSettings((prev) => ({
      ...prev,
      containerDefaults: {
        ...prev.containerDefaults,
        ...defaults,
        maxWidth: { ...prev.containerDefaults.maxWidth, ...defaults.maxWidth },
        padding: { ...prev.containerDefaults.padding, ...defaults.padding },
        margin: { ...prev.containerDefaults.margin, ...defaults.margin },
      },
    }));
  }, []);

  const updateCustomCSS = useCallback((css: string) => {
    setSettings((prev) => ({
      ...prev,
      customCSS: css,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultGlobalSettings);
  }, []);

  const getSpacingScale = useCallback((): SpacingScale => {
    return settings.spacingScale;
  }, [settings.spacingScale]);

  const getContainerDefaults = useCallback((): ContainerDefaults => {
    return settings.containerDefaults;
  }, [settings.containerDefaults]);

  const getColor = useCallback((key: string): string | undefined => {
    return settings.colorPalette[key];
  }, [settings.colorPalette]);

  const getTypography = useCallback((
    type: "headings" | "body",
    property: "fontFamily" | "fontSize" | "lineHeight" | "letterSpacing",
    breakpoint: "desktop" | "tablet" | "mobile" = "desktop",
    element: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" = "body"
  ): string | number | undefined => {
    const typo = settings.typography;
    
    switch (property) {
      case "fontFamily":
        return typo.fontFamily?.[type];
      case "fontSize":
        return typo.fontSize?.[breakpoint]?.[element];
      case "lineHeight":
        return typo.lineHeight?.[type];
      case "letterSpacing":
        return typo.letterSpacing?.[type];
      default:
        return undefined;
    }
  }, [settings.typography]);

  return (
    <GlobalSettingsContext.Provider
      value={{
        settings,
        updateColorPalette,
        updateTypography,
        updateSpacingScale,
        updateContainerDefaults,
        updateCustomCSS,
        resetSettings,
        getColor,
        getTypography,
        getSpacingScale,
        getContainerDefaults,
      }}
    >
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettings = (): GlobalSettingsContextType => {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error("useGlobalSettings must be used within a GlobalSettingsProvider");
  }
  return context;
};

