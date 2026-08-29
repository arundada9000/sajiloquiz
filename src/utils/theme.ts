// Theme utility. Each color scheme is a complete visual theme (its own
// background, surfaces, text, tint, status colors, glass and shadows) with a
// light and a dark variant, mirroring how iOS themes stay coherent across
// appearances. applyTheme() emits the full token set for the active scheme so
// every component reflects the chosen theme rather than just swapping a tint.

export type ColorSchemeId =
  | "purple"
  | "indigo"
  | "blue"
  | "teal"
  | "green"
  | "orange"
  | "red"
  | "pink"
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

type ThemeDef = {
  name: string;
  brand: string;           // preview swatch hex
  accentSwatch: string;    // preview swatch hex
  light: PaletteEntry;
  dark: PaletteEntry;
};

// Palette values adopt the reference iOS HIG system color language where
// appropriate and pair each accent family with a coherent surface story.
const themes: Record<Exclude<ColorSchemeId, "custom">, ThemeDef> = {
  purple: {
    name: "Purple",
    brand: "#a855f7",
    accentSwatch: "#7c3aed",
    light: {
      bgBase: "244, 242, 248",
      bgElevated: "255, 255, 255",
      textPrimary: "17, 15, 22",
      textSecondary: "100, 92, 110",
      primary: "175, 82, 222",
      secondary: "147, 51, 234",
      accent: "126, 34, 206",
      success: "34, 197, 94",
      danger: "239, 68, 68",
      warning: "245, 158, 11",
      labelInverse: "255, 255, 255",
      cardBg: "rgba(255, 255, 255, 0.94)",
      cardBorder: "rgba(60, 60, 67, 0.14)",
      cardShadow: "rgba(60, 60, 67, 0.12)",
      fill: "rgba(60, 60, 67, 0.06)",
      separator: "rgba(60, 60, 67, 0.12)",
      materialThick: "rgba(255, 255, 255, 0.92)",
      materialRegular: "rgba(255, 255, 255, 0.78)",
      materialThin: "rgba(255, 255, 255, 0.6)",
      glassBorder: "rgba(60, 60, 67, 0.14)",
    },
    dark: {
      bgBase: "22, 18, 28",
      bgElevated: "38, 33, 48",
      textPrimary: "250, 247, 253",
      textSecondary: "180, 170, 192",
      primary: "194, 115, 240",
      secondary: "168, 85, 247",
      accent: "147, 51, 234",
      success: "52, 211, 153",
      danger: "251, 113, 133",
      warning: "251, 191, 36",
      labelInverse: "20, 12, 30",
      cardBg: "rgba(255, 255, 255, 0.06)",
      cardBorder: "rgba(255, 255, 255, 0.12)",
      cardShadow: "rgba(0, 0, 0, 0.4)",
      fill: "rgba(255, 255, 255, 0.06)",
      separator: "rgba(255, 255, 255, 0.12)",
      materialThick: "rgba(30, 26, 38, 0.85)",
      materialRegular: "rgba(30, 26, 38, 0.72)",
      materialThin: "rgba(30, 26, 38, 0.55)",
      glassBorder: "rgba(255, 255, 255, 0.1)",
    },
  },
  indigo: {
    name: "Indigo",
    brand: "#6366f1",
    accentSwatch: "#4f46e5",
    light: {
      bgBase: "243, 243, 249",
      bgElevated: "255, 255, 255",
      textPrimary: "15, 16, 28",
      textSecondary: "94, 98, 130",
      primary: "88, 86, 214",
      secondary: "99, 102, 241",
      accent: "79, 70, 229",
      success: "34, 197, 94",
      danger: "239, 68, 68",
      warning: "245, 158, 11",
      labelInverse: "255, 255, 255",
      cardBg: "rgba(255, 255, 255, 0.94)",
      cardBorder: "rgba(60, 60, 67, 0.14)",
      cardShadow: "rgba(60, 60, 67, 0.12)",
      fill: "rgba(60, 60, 67, 0.06)",
      separator: "rgba(60, 60, 67, 0.12)",
      materialThick: "rgba(255, 255, 255, 0.92)",
      materialRegular: "rgba(255, 255, 255, 0.78)",
      materialThin: "rgba(255, 255, 255, 0.6)",
      glassBorder: "rgba(60, 60, 67, 0.14)",
    },
    dark: {
      bgBase: "16, 17, 30",
      bgElevated: "32, 34, 54",
      textPrimary: "246, 247, 253",
      textSecondary: "168, 172, 205",
      primary: "129, 140, 248",
      secondary: "112, 119, 247",
      accent: "99, 102, 241",
      success: "52, 211, 153",
      danger: "251, 113, 133",
      warning: "251, 191, 36",
      labelInverse: "14, 15, 26",
      cardBg: "rgba(255, 255, 255, 0.06)",
      cardBorder: "rgba(255, 255, 255, 0.12)",
      cardShadow: "rgba(0, 0, 0, 0.42)",
      fill: "rgba(255, 255, 255, 0.06)",
      separator: "rgba(255, 255, 255, 0.12)",
      materialThick: "rgba(23, 24, 44, 0.85)",
      materialRegular: "rgba(23, 24, 44, 0.72)",
      materialThin: "rgba(23, 24, 44, 0.55)",
      glassBorder: "rgba(255, 255, 255, 0.1)",
    },
  },
  blue: {
    name: "Ocean",
    brand: "#38bdf8",
    accentSwatch: "#0ea5e9",
    light: {
      bgBase: "240, 246, 250",
      bgElevated: "255, 255, 255",
      textPrimary: "14, 24, 33",
      textSecondary: "84, 105, 124",
      primary: "2, 132, 199",
      secondary: "3, 105, 161",
      accent: "14, 100, 150",
      success: "16, 185, 129",
      danger: "220, 38, 38",
      warning: "217, 119, 6",
      labelInverse: "255, 255, 255",
      cardBg: "rgba(255, 255, 255, 0.94)",
      cardBorder: "rgba(100, 130, 155, 0.22)",
      cardShadow: "rgba(60, 80, 100, 0.12)",
      fill: "rgba(60, 90, 115, 0.06)",
      separator: "rgba(100, 130, 155, 0.18)",
      materialThick: "rgba(255, 255, 255, 0.92)",
      materialRegular: "rgba(255, 255, 255, 0.78)",
      materialThin: "rgba(255, 255, 255, 0.6)",
      glassBorder: "rgba(100, 130, 155, 0.22)",
    },
    dark: {
      bgBase: "7, 13, 24",
      bgElevated: "14, 24, 42",
      textPrimary: "240, 246, 252",
      textSecondary: "158, 181, 208",
      primary: "56, 189, 248",
      secondary: "14, 165, 233",
      accent: "2, 132, 199",
      success: "52, 211, 153",
      danger: "251, 113, 133",
      warning: "251, 191, 36",
      labelInverse: "5, 19, 34",
      cardBg: "rgba(255, 255, 255, 0.06)",
      cardBorder: "rgba(126, 147, 174, 0.25)",
      cardShadow: "rgba(0, 0, 0, 0.45)",
      fill: "rgba(255, 255, 255, 0.06)",
      separator: "rgba(126, 147, 174, 0.2)",
      materialThick: "rgba(10, 18, 32, 0.85)",
      materialRegular: "rgba(10, 18, 32, 0.72)",
      materialThin: "rgba(10, 18, 32, 0.55)",
      glassBorder: "rgba(126, 147, 174, 0.25)",
    },
  },
  teal: {
    name: "Teal",
    brand: "#2dd4bf",
    accentSwatch: "#0d9488",
    light: {
      bgBase: "240, 247, 246",
      bgElevated: "255, 255, 255",
      textPrimary: "13, 27, 26",
      textSecondary: "74, 110, 105",
      primary: "13, 148, 136",
      secondary: "20, 184, 166",
      accent: "11, 118, 110",
      success: "16, 185, 129",
      danger: "225, 29, 72",
      warning: "217, 119, 6",
      labelInverse: "255, 255, 255",
      cardBg: "rgba(255, 255, 255, 0.94)",
      cardBorder: "rgba(60, 110, 105, 0.18)",
      cardShadow: "rgba(60, 100, 95, 0.12)",
      fill: "rgba(60, 110, 105, 0.06)",
      separator: "rgba(60, 110, 105, 0.16)",
      materialThick: "rgba(255, 255, 255, 0.92)",
      materialRegular: "rgba(255, 255, 255, 0.78)",
      materialThin: "rgba(255, 255, 255, 0.6)",
      glassBorder: "rgba(60, 110, 105, 0.18)",
    },
    dark: {
      bgBase: "9, 22, 21",
      bgElevated: "18, 40, 38",
      textPrimary: "240, 251, 250",
      textSecondary: "150, 195, 190",
      primary: "45, 212, 191",
      secondary: "20, 184, 166",
      accent: "13, 148, 136",
      success: "52, 211, 153",
      danger: "251, 113, 133",
      warning: "251, 191, 36",
      labelInverse: "6, 26, 24",
      cardBg: "rgba(255, 255, 255, 0.06)",
      cardBorder: "rgba(120, 170, 165, 0.24)",
      cardShadow: "rgba(0, 0, 0, 0.45)",
      fill: "rgba(255, 255, 255, 0.06)",
      separator: "rgba(120, 170, 165, 0.18)",
      materialThick: "rgba(12, 30, 28, 0.85)",
      materialRegular: "rgba(12, 30, 28, 0.72)",
      materialThin: "rgba(12, 30, 28, 0.55)",
      glassBorder: "rgba(120, 170, 165, 0.24)",
    },
  },
  green: {
    name: "Paper",
    brand: "#4ade80",
    accentSwatch: "#16a34a",
    light: {
      bgBase: "242, 248, 243",
      bgElevated: "255, 255, 255",
      textPrimary: "15, 26, 18",
      textSecondary: "84, 110, 92",
      primary: "21, 128, 61",
      secondary: "22, 163, 74",
      accent: "17, 120, 56",
      success: "22, 163, 74",
      danger: "225, 29, 72",
      warning: "194, 120, 12",
      labelInverse: "255, 255, 255",
      cardBg: "rgba(255, 255, 255, 0.94)",
      cardBorder: "rgba(60, 110, 75, 0.16)",
      cardShadow: "rgba(50, 90, 65, 0.12)",
      fill: "rgba(50, 100, 65, 0.06)",
      separator: "rgba(60, 110, 75, 0.14)",
      materialThick: "rgba(255, 255, 255, 0.92)",
      materialRegular: "rgba(255, 255, 255, 0.78)",
      materialThin: "rgba(255, 255, 255, 0.6)",
      glassBorder: "rgba(60, 110, 75, 0.16)",
    },
    dark: {
      bgBase: "10, 22, 14",
      bgElevated: "19, 40, 26",
      textPrimary: "240, 251, 244",
      textSecondary: "150, 193, 164",
      primary: "74, 222, 128",
      secondary: "34, 197, 94",
      accent: "22, 163, 74",
      success: "52, 211, 153",
      danger: "251, 113, 133",
      warning: "251, 191, 36",
      labelInverse: "8, 28, 16",
      cardBg: "rgba(255, 255, 255, 0.06)",
      cardBorder: "rgba(120, 175, 140, 0.24)",
      cardShadow: "rgba(0, 0, 0, 0.45)",
      fill: "rgba(255, 255, 255, 0.06)",
      separator: "rgba(120, 175, 140, 0.18)",
      materialThick: "rgba(12, 30, 18, 0.85)",
      materialRegular: "rgba(12, 30, 18, 0.72)",
      materialThin: "rgba(12, 30, 18, 0.55)",
      glassBorder: "rgba(120, 175, 140, 0.24)",
    },
  },
  orange: {
    name: "Sunset",
    brand: "#fb923c",
    accentSwatch: "#ea580c",
    light: {
      bgBase: "250, 245, 240",
      bgElevated: "255, 253, 250",
      textPrimary: "36, 26, 14",
      textSecondary: "120, 96, 68",
      primary: "217, 119, 6",
      secondary: "234, 88, 12",
      accent: "194, 75, 6",
      success: "179, 132, 18",
      danger: "192, 40, 34",
      warning: "194, 120, 12",
      labelInverse: "255, 255, 255",
      cardBg: "rgba(255, 253, 250, 0.94)",
      cardBorder: "rgba(150, 100, 55, 0.2)",
      cardShadow: "rgba(120, 80, 40, 0.12)",
      fill: "rgba(150, 100, 55, 0.07)",
      separator: "rgba(150, 100, 55, 0.16)",
      materialThick: "rgba(255, 253, 250, 0.92)",
      materialRegular: "rgba(255, 253, 250, 0.78)",
      materialThin: "rgba(255, 253, 250, 0.6)",
      glassBorder: "rgba(150, 100, 55, 0.2)",
    },
    dark: {
      bgBase: "28, 18, 10",
      bgElevated: "48, 32, 18",
      textPrimary: "253, 246, 237",
      textSecondary: "200, 168, 138",
      primary: "251, 146, 60",
      secondary: "234, 88, 12",
      accent: "234, 88, 12",
      success: "52, 211, 153",
      danger: "251, 113, 133",
      warning: "251, 191, 36",
      labelInverse: "40, 20, 6",
      cardBg: "rgba(255, 255, 255, 0.06)",
      cardBorder: "rgba(255, 190, 140, 0.2)",
      cardShadow: "rgba(0, 0, 0, 0.45)",
      fill: "rgba(255, 255, 255, 0.06)",
      separator: "rgba(255, 190, 140, 0.16)",
      materialThick: "rgba(30, 18, 10, 0.85)",
      materialRegular: "rgba(30, 18, 10, 0.72)",
      materialThin: "rgba(30, 18, 10, 0.55)",
      glassBorder: "rgba(255, 190, 140, 0.2)",
    },
  },
  red: {
    name: "Crimson",
    brand: "#f87171",
    accentSwatch: "#dc2626",
    light: {
      bgBase: "250, 243, 243",
      bgElevated: "255, 255, 255",
      textPrimary: "36, 15, 15",
      textSecondary: "130, 90, 90",
      primary: "220, 38, 38",
      secondary: "239, 68, 68",
      accent: "185, 28, 28",
      success: "22, 163, 74",
      danger: "225, 29, 72",
      warning: "194, 120, 12",
      labelInverse: "255, 255, 255",
      cardBg: "rgba(255, 255, 255, 0.94)",
      cardBorder: "rgba(150, 60, 60, 0.18)",
      cardShadow: "rgba(120, 50, 50, 0.12)",
      fill: "rgba(150, 60, 60, 0.06)",
      separator: "rgba(150, 60, 60, 0.14)",
      materialThick: "rgba(255, 255, 255, 0.92)",
      materialRegular: "rgba(255, 255, 255, 0.78)",
      materialThin: "rgba(255, 255, 255, 0.6)",
      glassBorder: "rgba(150, 60, 60, 0.18)",
    },
    dark: {
      bgBase: "28, 13, 14",
      bgElevated: "48, 24, 26",
      textPrimary: "253, 242, 242",
      textSecondary: "200, 155, 155",
      primary: "248, 113, 113",
      secondary: "239, 68, 68",
      accent: "220, 38, 38",
      success: "52, 211, 153",
      danger: "251, 113, 133",
      warning: "251, 191, 36",
      labelInverse: "40, 8, 10",
      cardBg: "rgba(255, 255, 255, 0.06)",
      cardBorder: "rgba(255, 155, 155, 0.2)",
      cardShadow: "rgba(0, 0, 0, 0.45)",
      fill: "rgba(255, 255, 255, 0.06)",
      separator: "rgba(255, 155, 155, 0.16)",
      materialThick: "rgba(30, 12, 13, 0.85)",
      materialRegular: "rgba(30, 12, 13, 0.72)",
      materialThin: "rgba(30, 12, 13, 0.55)",
      glassBorder: "rgba(255, 155, 155, 0.2)",
    },
  },
  pink: {
    name: "Blush",
    brand: "#f472b6",
    accentSwatch: "#db2777",
    light: {
      bgBase: "250, 243, 247",
      bgElevated: "255, 255, 255",
      textPrimary: "36, 15, 26",
      textSecondary: "128, 92, 108",
      primary: "219, 39, 119",
      secondary: "236, 72, 153",
      accent: "190, 24, 93",
      success: "22, 163, 74",
      danger: "225, 29, 72",
      warning: "194, 120, 12",
      labelInverse: "255, 255, 255",
      cardBg: "rgba(255, 255, 255, 0.94)",
      cardBorder: "rgba(150, 80, 105, 0.18)",
      cardShadow: "rgba(130, 60, 90, 0.12)",
      fill: "rgba(150, 80, 105, 0.06)",
      separator: "rgba(150, 80, 105, 0.14)",
      materialThick: "rgba(255, 255, 255, 0.92)",
      materialRegular: "rgba(255, 255, 255, 0.78)",
      materialThin: "rgba(255, 255, 255, 0.6)",
      glassBorder: "rgba(150, 80, 105, 0.18)",
    },
    dark: {
      bgBase: "30, 16, 24",
      bgElevated: "52, 28, 42",
      textPrimary: "253, 242, 248",
      textSecondary: "205, 160, 180",
      primary: "244, 114, 182",
      secondary: "236, 72, 153",
      accent: "219, 39, 119",
      success: "52, 211, 153",
      danger: "251, 113, 133",
      warning: "251, 191, 36",
      labelInverse: "44, 10, 28",
      cardBg: "rgba(255, 255, 255, 0.06)",
      cardBorder: "rgba(255, 170, 205, 0.2)",
      cardShadow: "rgba(0, 0, 0, 0.45)",
      fill: "rgba(255, 255, 255, 0.06)",
      separator: "rgba(255, 170, 205, 0.16)",
      materialThick: "rgba(34, 15, 27, 0.85)",
      materialRegular: "rgba(34, 15, 27, 0.72)",
      materialThin: "rgba(34, 15, 27, 0.55)",
      glassBorder: "rgba(255, 170, 205, 0.2)",
    },
  },
  graphite: {
    name: "Slate",
    brand: "#94a3b8",
    accentSwatch: "#475569",
    light: {
      bgBase: "242, 242, 247",
      bgElevated: "255, 255, 255",
      textPrimary: "17, 17, 20",
      textSecondary: "104, 104, 112",
      primary: "60, 60, 67",
      secondary: "94, 94, 105",
      accent: "44, 44, 50",
      success: "52, 199, 89",
      danger: "255, 59, 48",
      warning: "255, 149, 0",
      labelInverse: "255, 255, 255",
      cardBg: "rgba(255, 255, 255, 0.94)",
      cardBorder: "rgba(60, 60, 67, 0.15)",
      cardShadow: "rgba(60, 60, 67, 0.12)",
      fill: "rgba(60, 60, 67, 0.06)",
      separator: "rgba(60, 60, 67, 0.14)",
      materialThick: "rgba(255, 255, 255, 0.92)",
      materialRegular: "rgba(255, 255, 255, 0.78)",
      materialThin: "rgba(255, 255, 255, 0.6)",
      glassBorder: "rgba(60, 60, 67, 0.15)",
    },
    dark: {
      bgBase: "0, 0, 0",
      bgElevated: "28, 28, 30",
      textPrimary: "255, 255, 255",
      textSecondary: "167, 167, 173",
      primary: "10, 132, 255",
      secondary: "64, 156, 255",
      accent: "109, 176, 255",
      success: "48, 209, 88",
      danger: "255, 69, 58",
      warning: "255, 159, 10",
      labelInverse: "255, 255, 255",
      cardBg: "rgba(255, 255, 255, 0.06)",
      cardBorder: "rgba(84, 84, 88, 0.36)",
      cardShadow: "rgba(0, 0, 0, 0.5)",
      fill: "rgba(120, 120, 128, 0.16)",
      separator: "rgba(84, 84, 88, 0.36)",
      materialThick: "rgba(28, 28, 30, 0.85)",
      materialRegular: "rgba(28, 28, 30, 0.72)",
      materialThin: "rgba(28, 28, 30, 0.55)",
      glassBorder: "rgba(84, 84, 88, 0.36)",
    },
  },
};

// A custom palette builds its own palette off a neutral light/dark surface
// story keyed by the provided tint, with automatic inverse contrast.
function buildCustom(theme: ThemeConfig, isDark: boolean): PaletteEntry {
  const base = themes.purple[isDark ? "dark" : "light"];
  const primary = theme.customTint?.primary || base.primary;
  const secondary = theme.customTint?.secondary || base.secondary;
  const accent = theme.customTint?.accent || base.accent;

  const [r, g, b] = primary.split(",").map((n) => Number(n.trim()));
  // Luminance-based contrast: dark text on light tints, light on dark tints.
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const labelInverse =
    lum > 0.6 ? "20, 20, 20" : "255, 255, 255";

  return {
    ...base,
    primary,
    secondary,
    accent,
    labelInverse,
  };
}

function resolveScheme(theme: ThemeConfig, isDark: boolean): PaletteEntry {
  if (theme.colorScheme === "custom") {
    return buildCustom(theme, isDark);
  }
  return themes[theme.colorScheme][isDark ? "dark" : "light"];
}

const isSystemDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement;
  const isDark =
    theme.mode === "auto" ? isSystemDark() : theme.mode === "dark";
  const p = resolveScheme(theme, isDark);

  const bgElevated = p.bgElevated;

  // Tint
  root.style.setProperty("--color-primary", p.primary);
  root.style.setProperty("--color-secondary", p.secondary);
  root.style.setProperty("--color-accent", p.accent);
  root.style.setProperty("--tint", p.secondary);
  root.style.setProperty("--tint-secondary", p.secondary);
  root.style.setProperty("--tint-tertiary", p.accent);

  // Surfaces
  root.style.setProperty("--bg-base", p.bgBase);
  root.style.setProperty("--bg-elevated", bgElevated);
  root.style.setProperty("--secondary-background", isDark ? "28, 28, 34" : "242, 242, 247");
  root.style.setProperty("--card-bg", p.cardBg);
  root.style.setProperty("--card-border", p.cardBorder);
  root.style.setProperty("--card-shadow", p.cardShadow);
  root.style.setProperty("--fill", p.fill);
  root.style.setProperty("--separator", p.separator);

  // Text
  root.style.setProperty("--text-primary", p.textPrimary);
  root.style.setProperty("--text-secondary", p.textSecondary);
  root.style.setProperty("--text-contrast", isDark ? "0, 0, 0" : "255, 255, 255");
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
