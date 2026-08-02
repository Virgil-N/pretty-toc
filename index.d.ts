import type { HastPluginDefinition } from "satteri";
import type { Element, Parents } from "hast";

export interface tagHasProperty {
  summary?: string;
  ul?: string;
  li?: string;
  a?: string;
}

export interface HastOption {
  /** TOC标题 */
  title?: string;
  /** 列表形式 */
  listStyle?: string;
  /** 图标 */
  icon?: string | string[];
  /** 图片路径 */
  image?: string;
  /** 标记大小 */
  markerCssSize?: string;
  /** 浅色主题高亮颜色 */
  lightThemeHighlightColor?: string;
  /** 深色主题高亮颜色 */
  darkThemeHighlightColor?: string;
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
  rootNode: Readonly<Parents> | undefined;
  nodeStr: string;
}

export declare function prettyToc(options?: HastOption): HastPluginDefinition;
