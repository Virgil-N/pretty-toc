import type { HastOption } from "../basic";
export const DEFAULT_TITLE = "Table of Contents";
export const DEFAULT_OPENED_TITLE_MARKER = "▼";
export const DEFAULT_CLOSED_TITLE_MARKER = "▶︎";
export const DEFAULT_TITLE_MARKER_TYPE = "icon";
export const DEFAULT_TITLE_MARKER_CSS_SIZE = "fit-content";
export const DEFALUT_LOCALE = "en-US";
export const DEFAULT_LIST_STYLE = "decimal";
export const DEFAULT_LI_MARKER_CSS_SIZE = "1.5rem";
export const DEFAULT_ANIMATION = {
  duration: "0.8s",
  timingFunction: 'ease-in-out'
};
export const DEFAULT_LIGHT_THEME_HIGHLIGHT_COLOR = "oklch(0.75 0.1229 12.71)";
export const DEFAULT_DARK_THEME_HIGHLIGHT_COLOR = "oklch(0.81 0.1004 305.04)";
export const DEFAULT_LANGUAGE_MAP: Record<string, string> = {
  "de-DE": "Inhaltsverzeichnis",
  "el-GR": "Περιεχόμενα",
  "en-US": "Contents",
  "es-ES": "Índice",
  "fr-FR": "Sommaire",
  "it-IT": "Indice",
  "ja-JP": "目次",
  "ko-KR": "목차",
  "ru-RU": "Оглавление",
  "th-TH": "สารบัญ",
  "tr-TR": "İçindekiler",
  "zh-CN": "目录",
  "zh-Hant": "目錄",
};

export const DEFAULT_OPTIONS: HastOption = {
  title: DEFAULT_TITLE,
  listStyle: DEFAULT_LIST_STYLE, // disc, circle, decimal, none...
  titleMarkerType: DEFAULT_TITLE_MARKER_TYPE,
  titleMarkerCssSize: DEFAULT_TITLE_MARKER_CSS_SIZE,
  lightThemeHighlightColor: DEFAULT_LIGHT_THEME_HIGHLIGHT_COLOR,
  darkThemeHighlightColor: DEFAULT_DARK_THEME_HIGHLIGHT_COLOR,
  liMarkerCssSize: DEFAULT_LI_MARKER_CSS_SIZE,
  class: {
    title: "",
    ul: "",
    li: "",
    a: "",
  },
  globalStyle: "",
  style: {
    title: "",
    ul: "",
    li: "",
    a: "",
  },
  locale: DEFALUT_LOCALE,
  languageMap: DEFAULT_LANGUAGE_MAP
};
