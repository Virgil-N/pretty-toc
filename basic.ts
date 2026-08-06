import type { Element } from "hast";

export interface tagHasProperty {
  title?: string;
  ul?: string;
  li?: string;
  a?: string;
}

export interface HastOption {
  /** TOC标题 */
  title?: string;
  /** 展开时的标记 */
  openedMarker?: string;
  /** 关闭时的标记 */
  closedMarker?: string;
  /** 标题标记类型 "icon" | "image" */
  titleMarkerType?: string;
  /** TOC标题标记大小 */
  titleMarkerCssSize?: string;
  /** 列表形式 */
  listStyle?: string;
  /** 图标 */
  icon?: string | string[];
  /** 图片路径 */
  image?: string | string[];
  /** 列表项标记大小 */
  liMarkerCssSize?: string;
  /** 浅色主题高亮颜色 */
  lightThemeHighlightColor?: string;
  /** 深色主题高亮颜色 */
  darkThemeHighlightColor?: string;
  /** 动画 */
  animation?: boolean | { duration: string, timingFunction: string };
  /** 类名 */
  class?: tagHasProperty;
  /** 全局样式 */
  globalStyle?: string;
  /** 样式 */
  style?: tagHasProperty;
  /** 语言环境 */
  locale?: string;
  /** 标题文本映射 */
  languageMap?: Record<string, string>;
}

export interface Data {
  firstHeading: Readonly<Element>;
  firstHeadingDepth: number;
  firstHeadingId: string;
  firstHeadingIndex: number;
  nodeStr: string;
}
