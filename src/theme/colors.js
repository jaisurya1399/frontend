// Central enterprise design tokens for the project management application.
export const PRIMARY = "#4F46E5";
export const PRIMARY_HOVER = "#4338CA";
export const PRIMARY_SUBTLE = "#EEF2FF";
export const PRIMARY_TINT = "#E0E7FF";
export const SECONDARY = "#475569";
export const ACCENT_PURPLE = "#7C3AED";

export const CANVAS_BACKGROUND = "#F3F5FA";
export const SURFACE = "#FFFFFF";
export const SURFACE_SUBTLE = "#F7F8FC";
export const BORDER = "#E7EAF0";
export const BORDER_STRONG = "#D7DBE4";

export const TEXT_PRIMARY = "#111827";
export const TEXT_SECONDARY = "#667085";
// Was #94A3B8 (2.56:1 on white — fails WCAG AA for text). Darkened to a
// value that still reads as "muted" but clears 4.5:1 for any readable
// content (labels, section headers, placeholders). Reserve the old, lighter
// #94A3B8 only for genuinely non-text/disabled UI, which is exempt.
export const TEXT_FAINT = "#98A2B3";

export const SEMANTIC_COLORS = {
  success: { main: "#15803D", bg: "#F0FDF4", border: "#BBF7D0" },
  info: { main: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  warning: { main: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
  error: { main: "#B91C1C", bg: "#FEF2F2", border: "#FECACA" },
  neutral: { main: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
  critical: { main: "#C2410C", bg: "#FFF7ED", border: "#FED7AA" },
};

export const STATUS_COLORS = {
  TODO: { bg: "#F1F5F9", text: "#475569" },
  IN_PROGRESS: { bg: "#EFF6FF", text: "#1D4ED8" },
  DONE: { bg: "#F0FDF4", text: "#15803D" },
  COMPLETED: { bg: "#F0FDF4", text: "#15803D" },
  PENDING: { bg: "#FFFBEB", text: "#B45309" },
  FAILED: { bg: "#FEF2F2", text: "#B91C1C" },
  OVERDUE: { bg: "#FFF7ED", text: "#C2410C" },
  DRAFT: { bg: "#F8FAFC", text: "#64748B" },
};

export const PRIORITY_COLORS = {
  HIGHEST: "#B91C1C",
  HIGH: "#C2410C",
  MEDIUM: "#B45309",
  LOW: "#2563EB",
  LOWEST: "#64748B",
};

export const ISSUE_TYPE_COLORS = {
  STORY: "#15803D",
  TASK: "#1D4ED8",
  BUG: "#B91C1C",
  EPIC: "#6366F1",
  SUBTASK: "#2563EB",
};

export const TOPBAR = {
  background: "rgba(255,255,255,.94)",
  height: 68,
  textPrimary: TEXT_PRIMARY,
  iconSecondary: TEXT_SECONDARY,
  border: BORDER,
};

export const SIDEBAR = {
  background: "#111827",
  border: "rgba(255,255,255,.08)",
  width: 264,
  itemText: "#CBD5E1",
  itemIcon: "#94A3B8",
  itemHoverBg: "rgba(255,255,255,.07)",
  itemSelectedBg:
    "linear-gradient(90deg, rgba(99,102,241,.28), rgba(124,58,237,.16))",
  itemSelectedText: "#FFFFFF",
  itemSelectedIndicator: "#818CF8",
  sectionHeader: "#64748B",
};

export const RADIUS = {
  card: 4,
  panel: 16,
  dialog: 20,
  chip: 999,
  button: 10,
  input: 10,
};

export const ELEVATION_SHADOW =
  "0 1px 2px rgba(15,23,42,.04), 0 8px 24px rgba(15,23,42,.06)";

// Tiered elevation used for hover/lift micro-interactions on cards,
// menus and dialogs. Kept intentionally soft and cool-toned so depth
// reads as "premium" rather than heavy/skeuomorphic.
export const SHADOW = {
  xs: "0 1px 2px rgba(15,23,42,.05)",
  sm: "0 2px 6px rgba(15,23,42,.06), 0 1px 2px rgba(15,23,42,.04)",
  md: "0 8px 24px rgba(15,23,42,.08), 0 2px 6px rgba(15,23,42,.05)",
  lg: "0 20px 48px rgba(15,23,42,.14), 0 4px 12px rgba(15,23,42,.06)",
  focus: `0 0 0 3px ${PRIMARY_TINT}`,
};

// Shared motion tokens so every hover/press/expand animation in the app
// eases at the same rate. Durations are short (140-220ms) to feel snappy
// on an internal tool rather than showy.
export const MOTION = {
  fast: "140ms",
  base: "200ms",
  slow: "320ms",
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  easingOut: "cubic-bezier(0, 0, 0.2, 1)",
};
