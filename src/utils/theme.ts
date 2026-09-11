// Theme utility. Following the iOS HIG the app keeps ONE shared surface
// language (the exact iOS system backgrounds, label colors, fills and
// separators) for both appearances, and each color scheme only varies the tint
// family using the Apple system colors. This is how iOS itself behaves: switch
// accent in Settings and every surface stays the same, only the tint moves.
//
// applyTheme() emits the full token set for the active scheme so every
// component reflects the chosen theme rather than just swapping a tint.

export type ColorSchemeId =
  | "purple"
  | "indigo"
  | "blue"
  | "teal"
  | "green"
  | "orange"
  | "red"
  | "pink"
  | "cyan"
  | "graphite"
  | "custom";

export type ThemeConfig = {
  mode: "light" | "dark" | "auto";
  colorScheme: ColorSchemeId;
  customTint?: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

// RGB triplets are stored as "R, G, B" strings so consumers can append alpha
// in rgba() at the point of use. Surface/glass/border values are full CSS
// colors so they can be consumed directly by var(--...).
type PaletteEntry = {
  bgBase: string;          // app background (RGB triplet)
  bgElevated: string;      // card / elevated surface (RGB triplet)
  textPrimary: string;     // primary text (RGB triplet)
  textSecondary: string;   // secondary text (RGB triplet)
  primary: string;         // tint (RGB triplet)
  secondary: string;       // deeper tint (RGB triplet)
  accent: string;          // deepest tint (RGB triplet)
  success: string;         // status green (RGB triplet)
  danger: string;          // status red (RGB triplet)
  warning: string;         // status amber (RGB triplet)
  labelInverse: string;    // text on tint (RGB triplet)
  cardBg: string;          // card surface fill (CSS color)
  cardBorder: string;      // card hairline (CSS color)
  cardShadow: string;      // card shadow color (CSS color)
  fill: string;            // subtle fill for wells/inputs (CSS color)
  separator: string;       // hairline (CSS color)
  materialThick: string;   // frosted glass (CSS color)
  materialRegular: string; // frosted glass (CSS color)
  materialThin: string;    // frosted glass (CSS color)
  glassBorder: string;     // glass hairline (CSS color)
};

// A scheme only defines its tint family. Tints follow the Apple system colors
// (their light and dark variants) with a slightly deeper secondary and accent
// so buttons, links and focus rings stay layered.
type TintSet = {
  primary: string;  // RGB triplet
  secondary: string; // RGB triplet
  accent: string;   // RGB triplet
};

type ThemeDef = {
  name: string;
  brand: string;           // preview swatch hex
  accentSwatch: string;    // preview swatch hex
  light: TintSet;
  dark: TintSet;
};

// Shared surface story. Exactly the iOS system color semantics:
// light  -> systemGroupedBackground + black label, dark  -> systemBackground + white label.
const lightSurfaces: Omit<PaletteEntry, keyof TintSet> = {
  bgBase: "242, 242, 247",
  bgElevated: "255, 255, 255",
  textPrimary: "0, 0, 0",
  textSecondary: "60, 60, 67",
  success: "52, 199, 89",
  danger: "255, 59, 48",
  warning: "255, 149, 0",
  labelInverse: "255, 255, 255",
  cardBg: "rgba(255, 255, 255, 0.94)",
  cardBorder: "rgba(60, 60, 67, 0.18)",
  cardShadow: "rgba(0, 0, 0, 0.12)",
  fill: "rgba(120, 120, 128, 0.12)",
  separator: "rgba(60, 60, 67, 0.12)",
  materialThick: "rgba(255, 255, 255, 0.92)",
  materialRegular: "rgba(255, 255, 255, 0.78)",
  materialThin: "rgba(255, 255, 255, 0.6)",
  glassBorder: "rgba(60, 60, 67, 0.18)",
};

const darkSurfaces: Omit<PaletteEntry, keyof TintSet> = {
  bgBase: "0, 0, 0",
  bgElevated: "28, 28, 30",
  textPrimary: "255, 255, 255",
  textSecondary: "235, 235, 245",
  success: "48, 209, 88",
  danger: "255, 69, 58",
  warning: "255, 159, 10",
  labelInverse: "255, 255, 255",
  cardBg: "rgba(120, 120, 128, 0.18)",
  cardBorder: "rgba(255, 255, 255, 0.12)",
  cardShadow: "rgba(0, 0, 0, 0.5)",
  fill: "rgba(255, 255, 255, 0.08)",
  separator: "rgba(255, 255, 255, 0.12)",
  materialThick: "rgba(28, 28, 30, 0.85)",
  materialRegular: "rgba(28, 28, 30, 0.72)",
  materialThin: "rgba(28, 28, 30, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.12)",
};

// Tint families keyed by the Apple system colors (light/dark variants).
const themes: Record<Exclude<ColorSchemeId, "custom">, ThemeDef> = {
  purple: {
    name: "Purple",
    brand: "#af52de",
    accentSwatch: "#bf5af2",
    light: { primary: "175, 82, 222", secondary: "158, 63, 207", accent: "140, 45, 183" },
    dark: { primary: "191, 90, 242", secondary: "206, 120, 248", accent: "221, 151, 255" },
  },
  indigo: {
    name: "Indigo",
    brand: "#5856d6",
    accentSwatch: "#5e5ce6",
    light: { primary: "88, 86, 214", secondary: "70, 68, 190", accent: "56, 54, 166" },
    dark: { primary: "94, 92, 230", secondary: "118, 116, 240", accent: "141, 140, 247" },
  },
  blue: {
    name: "Blue",
    brand: "#007aff",
    accentSwatch: "#0a84ff",
    light: { primary: "0, 122, 255", secondary: "0, 104, 217", accent: "0, 84, 178" },
    dark: { primary: "10, 132, 255", secondary: "64, 156, 255", accent: "109, 176, 255" },
  },
  teal: {
    name: "Teal",
    brand: "#30b0c7",
    accentSwatch: "#40c8e0",
    light: { primary: "48, 176, 199", secondary: "38, 155, 178", accent: "30, 134, 155" },
    dark: { primary: "64, 200, 224", secondary: "97, 212, 232", accent: "135, 224, 240" },
  },
  green: {
    name: "Green",
    brand: "#34c759",
    accentSwatch: "#30d158",
    light: { primary: "52, 199, 89", secondary: "38, 170, 74", accent: "28, 141, 61" },
    dark: { primary: "48, 209, 88", secondary: "82, 221, 118", accent: "117, 232, 149" },
  },
  orange: {
    name: "Orange",
    brand: "#ff9500",
    accentSwatch: "#ff9f0a",
    light: { primary: "255, 149, 0", secondary: "226, 128, 0", accent: "197, 108, 0" },
    dark: { primary: "255, 159, 10", secondary: "255, 175, 52", accent: "255, 191, 90" },
  },
  red: {
    name: "Red",
    brand: "#ff3b30",
    accentSwatch: "#ff453a",
    light: { primary: "255, 59, 48", secondary: "238, 39, 30", accent: "214, 22, 18" },
    dark: { primary: "255, 69, 58", secondary: "255, 105, 95", accent: "255, 141, 132" },
  },
  pink: {
    name: "Pink",
    brand: "#ff2d55",
    accentSwatch: "#ff375f",
    light: { primary: "255, 45, 85", secondary: "235, 22, 72", accent: "210, 12, 62" },
    dark: { primary: "255, 55, 95", secondary: "255, 86, 123", accent: "255, 117, 150" },
  },
  cyan: {
    name: "Cyan",
    brand: "#32ade6",
    accentSwatch: "#64d2ff",
    light: { primary: "50, 173, 230", secondary: "20, 148, 210", accent: "10, 120, 178" },
    dark: { primary: "100, 210, 255", secondary: "140, 222, 255", accent: "185, 237, 255" },
  },
  graphite: {
    name: "Slate",
    brand: "#8e8e93",
    accentSwatch: "#98989e",
    light: { primary: "110, 110, 118", secondary: "88, 88, 94", accent: "66, 66, 71" },
    dark: { primary: "174, 174, 182", secondary: "154, 154, 164", accent: "136, 136, 146" },
  },
};

// A custom palette starts from the shared surfaces and applies the user's
// triads, with automatic inverse contrast for its tint.
function buildCustom(theme: ThemeConfig, isDark: boolean): PaletteEntry {
  const surfaces = isDark ? darkSurfaces : lightSurfaces;
  const primary = theme.customTint?.primary || themes.purple.light.primary;
  const secondary = theme.customTint?.secondary || themes.purple.light.secondary;
  const accent = theme.customTint?.accent || themes.purple.light.accent;

  const [r, g, b] = primary.split(",").map((n) => Number(n.trim()));
  // Luminance-based contrast: dark text on light tints, light on dark tints.
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const labelInverse = lum > 0.6 ? "20, 20, 20" : "255, 255, 255";

  return {
    ...surfaces,
    primary,
    secondary,
    accent,
    labelInverse,
  };
}

function resolveScheme(theme: ThemeConfig, isDark: boolean): PaletteEntry {
  const surfaces = isDark ? darkSurfaces : lightSurfaces;
  if (theme.colorScheme === "custom") {
    return buildCustom(theme, isDark);
  }
  const tints = themes[theme.colorScheme][isDark ? "dark" : "light"];
  return { ...surfaces, ...tints };
}

const isSystemDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement;
  const isDark =
    theme.mode === "auto" ? isSystemDark() : theme.mode === "dark";
  const p = resolveScheme(theme, isDark);

  // Tint
  root.style.setProperty("--color-primary", p.primary);
  root.style.setProperty("--color-secondary", p.secondary);
  root.style.setProperty("--color-accent", p.accent);
  root.style.setProperty("--tint", p.secondary);
  root.style.setProperty("--tint-secondary", p.secondary);
  root.style.setProperty("--tint-tertiary", p.accent);

  // Surfaces
  root.style.setProperty("--bg-base", p.bgBase);
  root.style.setProperty("--bg-elevated", p.bgElevated);
  root.style.setProperty("--card-bg", p.cardBg);
  root.style.setProperty("--card-border", p.cardBorder);
  root.style.setProperty("--card-shadow", p.cardShadow);
  root.style.setProperty("--fill", p.fill);
  root.style.setProperty("--separator", p.separator);

  // Text
  root.style.setProperty("--text-primary", p.textPrimary);
  root.style.setProperty("--text-secondary", p.textSecondary);
  root.style.setProperty("--label", p.textPrimary);
  root.style.setProperty("--label-secondary", p.textSecondary);
  root.style.setProperty("--label-inverse", p.labelInverse);

  // Glass
  root.style.setProperty("--material-thick", p.materialThick);
  root.style.setProperty("--material-regular", p.materialRegular);
  root.style.setProperty("--material-thin", p.materialThin);
  root.style.setProperty("--glass-bg", p.materialRegular);
  root.style.setProperty("--glass-border", p.glassBorder);

  // Status
  root.style.setProperty("--success", p.success);
  root.style.setProperty("--danger", p.danger);
  root.style.setProperty("--warning", p.warning);

  root.setAttribute("data-theme-mode", isDark ? "dark" : "light");
}

// Watch for system theme changes in "auto" mode.
export function setupThemeListener(theme: ThemeConfig) {
  const handleChange = () => {
    if (theme.mode === "auto") {
      applyTheme(theme);
    }
  };
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
}