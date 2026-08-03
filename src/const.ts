import type { HastOption } from "../basic";
export const DEFAULT_TITLE = "Table of Contents";
export const DEFALUT_LOCALE = "en-US";
export const DEFAULT_LIST_STYLE = "decimal";
export const LANGUAGE_MAP = {
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
  lightThemeHighlightColor: "oklch(0.75 0.1229 12.71)",
  darkThemeHighlightColor: "oklch(0.81 0.1004 305.04)",
  class: {
    summary: "",
    ul: "",
    li: "",
    a: "",
  },
  globalStyle: "",
  style: {
    summary: "",
    ul: "",
    li: "",
    a: "",
  },
  locale: DEFALUT_LOCALE,
  languageMap: LANGUAGE_MAP
};
