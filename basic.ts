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

export interface CUSTOM_NODE {
  /** 深度 */
  depth: number;
  /** 节点文本内容 */
  content: string;
  /** 子节点数组 */
  children: Array<CUSTOM_NODE>;
  /** 父节点 */
  parent: CUSTOM_NODE | undefined;
}

export interface NODE_TREE {
  /** 根结点 */
  rootNode: CUSTOM_NODE;
  /** 遍历插入的上一个节点 */
  previousNode: CUSTOM_NODE;
}

export interface Data {
  /** 文档中第一个标题元素 */
  firstHeading: Readonly<Element>;
  /** 文档中第一个标题元素的深度 */
  firstHeadingDepth: number;
  /** 文档中第一个标题元素的ID */
  firstHeadingId: string;
  /** 文档中第一个标题元素的索引位置 */
  firstHeadingIndex: number;
  /** 生成的nodeTree包含的所有节点的html文本内容 */
  nodeStr: string;
  /** 遍历文档生成的nodeTree */
  nodeTree: NODE_TREE;
}
