import { defineHastPlugin, type HastPluginDefinition } from "satteri";
import {
  DEFAULT_OPTIONS,
  DEFAULT_TITLE,
  DEFAULT_LIST_MARKER_TYPE,
  DEFAULT_OPENED_TITLE_MARKER,
  DEFAULT_CLOSED_TITLE_MARKER,
  DEFAULT_TITLE_FONT_SIZE,
  DEFAULT_LIST_FONT_SIZE,
  DEFALUT_LOCALE,
  DEFAULT_ANIMATION,
  DEFAULT_LIGHT_THEME_HIGHLIGHT_COLOR,
  DEFAULT_DARK_THEME_HIGHLIGHT_COLOR,
  DEFAULT_LANGUAGE_MAP,
} from "./const";
import type {
  HastOption,
  CUSTOM_HEADING,
  CUSTOM_NODE,
  NODE_TREE,
} from "../basic";
import notFoundImg from "./assets/svg/image-not-found.svg";
import slug from "slug";

/**
 *
 * @param option 用户传入插件的配置
 * @returns 插件实例
 */
function prettyToc(option?: HastOption): HastPluginDefinition {
  const opt = option ?? DEFAULT_OPTIONS;
  const canCollapse = opt.canCollapse === undefined ? true : opt.canCollapse;
  const lightThemeHighlightColor =
    opt.lightThemeHighlightColor || DEFAULT_LIGHT_THEME_HIGHLIGHT_COLOR;
  const darkThemeHighlightColor =
    opt.darkThemeHighlightColor || DEFAULT_DARK_THEME_HIGHLIGHT_COLOR;
  const titleMarkerCssSize = opt.titleMarkerCssSize || DEFAULT_TITLE_FONT_SIZE;
  const openedMarker = canCollapse
    ? opt.openedMarker || DEFAULT_OPENED_TITLE_MARKER
    : "";
  const closedMarker = canCollapse
    ? opt.closedMarker || DEFAULT_CLOSED_TITLE_MARKER
    : "";
  const listMarkerCssSize = opt.listMarkerCssSize || DEFAULT_LIST_FONT_SIZE;

  let title = opt.title || DEFAULT_TITLE;
  let listMarkerType = DEFAULT_LIST_MARKER_TYPE;
  let animation:
    boolean | { duration: string; timingFunction: string } | undefined =
    undefined;

  let headingTree: NODE_TREE | undefined = undefined;
  let firstHeading: CUSTOM_HEADING = {};

  return defineHastPlugin({
    name: "prettyToc",
    element: [
      {
        filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
        visit(node, ctx) {
          try {
            const depth = parseInt(node.tagName.slice(-1), 10);
            const content = ctx.textContent(node);
            const contentSlug = slug(content) + "-" + crypto.randomUUID();

            if (opt.languageMap) {
              title =
                opt.languageMap[opt.locale ?? DEFALUT_LOCALE] || DEFAULT_TITLE;
            } else {
              title =
                DEFAULT_LANGUAGE_MAP[opt.locale ?? DEFALUT_LOCALE] ||
                DEFAULT_TITLE;
            }

            if (
              opt.listMarkerType === "icon" ||
              opt.listMarkerType === "image" ||
              opt.listMarkerType === "decimal" ||
              opt.listMarkerType === undefined
            ) {
              listMarkerType = "none";
            } else if (opt.listMarkerType !== undefined) {
              listMarkerType = opt.listMarkerType;
            }

            if (
              typeof opt.animation === "object" &&
              opt.animation !== undefined
            ) {
              animation = opt.animation ?? DEFAULT_ANIMATION;
            } else if (opt.animation === true) {
              animation = DEFAULT_ANIMATION;
            } else {
              animation = undefined;
            }

            let marker = "";
            let icon = "🍎";
            let image = notFoundImg;

            if (opt.icon && typeof opt.icon === "string") {
              icon = opt.icon;
            } else if (Array.isArray(opt.icon)) {
              icon = opt.icon[depth - 1] ?? "🍎";
            }

            if (opt.image && typeof opt.image === "string") {
              image = opt.image;
            } else if (Array.isArray(opt.image)) {
              image = opt.image[depth - 1] ?? notFoundImg;
            }

            switch (opt.listMarkerType) {
              case "icon":
                marker = `<span class='li-marker'>${icon}</span>`;
                break;
              case "image":
                marker = `<img class='li-marker' src="${image}" alt='icon' />`;
                break;
              case "decimal":
              case undefined:
                marker = "<span class='li-marker'></span>";
                break;
              default:
                marker = "";
            }

            let nodeStr = `<li id="li-${contentSlug}" class="${opt.class?.li ?? ""}" style="${opt.style?.li ?? ""}" data-depth=${depth}><div class="li-row">${marker}<a href="#${contentSlug}" class="${opt.class?.a ?? ""}" style="${opt.style?.a ?? ""}">${content}</a></div></li>`;

            ctx.setProperty(node, "id", contentSlug);

            if (headingTree === undefined) {
              firstHeading.headingText = ctx.textContent(node);
              firstHeading.headingDepth = depth;
              firstHeading.headingId = contentSlug;
              firstHeading.headingIndex = ctx.indexOf(node) ?? 0;

              const rootNode: CUSTOM_NODE = {
                depth: 0,
                content: "",
                children: [],
                parent: undefined,
              };
              headingTree = {
                rootNode,
                previousNode: rootNode,
              };
              if (depth === 1) {
                const currentNode = {
                  depth: 1,
                  content: nodeStr,
                  children: [],
                  parent: rootNode,
                };
                headingTree.rootNode.children.push(currentNode);
                headingTree.previousNode = currentNode;
              } else {
                for (let i = 1; i <= depth; i++) {
                  const currentNode = {
                    depth: i,
                    content: i === depth ? nodeStr : "",
                    children: [],
                    parent: headingTree.previousNode,
                  };
                  headingTree.previousNode.children.push(currentNode);
                  headingTree.previousNode = currentNode;
                }
              }
            } else {
              let hasFound = false;
              let nextSearchNode = headingTree.rootNode;

              searchNode: while (!hasFound) {
                if (nextSearchNode.depth + 1 === depth) {
                  const currentNode = {
                    depth: depth,
                    content: nodeStr,
                    children: [],
                    parent: nextSearchNode,
                  };
                  nextSearchNode.children.push(currentNode);
                  headingTree.previousNode = currentNode;
                  hasFound = true;
                  break searchNode;
                } else {
                  if (nextSearchNode.children.length > 0) {
                    nextSearchNode =
                      nextSearchNode.children[
                        nextSearchNode.children.length - 1
                      ];
                    continue searchNode;
                  } else {
                    const middleNode = {
                      depth: nextSearchNode.depth + 1,
                      content: "",
                      children: [],
                      parent: nextSearchNode,
                    };
                    nextSearchNode.children.push(middleNode);
                    nextSearchNode = middleNode;
                    continue searchNode;
                  }
                }
              }
            }
          } catch (err) {
            console.log("pretty-toc error: ", err);
          }
        },
      },
    ],
    before() {
      headingTree = undefined;
      firstHeading = {};
    },
    after(root, ctx) {
      if (headingTree !== undefined) {
        const collectedNodeStr = concatNodeStr(headingTree.rootNode, opt);
        const baseStyle = `
          .toc-wrapper {
            display: grid;
            grid-template-rows: 0fr;
            overflow: hidden;
            margin-bottom: 2rem;
            &:has(.toc-title.open) {
              grid-template-rows: 1fr;
            }
            .toc-title {
              font-size: ${titleMarkerCssSize};
              font-weight: 600;
              margin: 0;
              width: fit-content;
              position: relative;
              display: inline-flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: flex-end;
            }
            .title-marker {
              display: inline-flex;
              height: 100%;
              align-items: center;
            }
            ul {
              padding-left: var(--list-indent, 1.5rem);
              list-style-type: ${listMarkerType} ;
              list-style-position: inside;
            }
            ul:not(:has(> li)) {
              padding-left: 0;
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            li {
              padding: 0;
              line-height: 1.5rem;
              font-size: ${listMarkerCssSize};
              animation: fadeIn 0.01s ease-in; // 防止页面刷新瞬间显示"0 javascript"
            }
            .li-marker {
              display: inline-block;
              margin-right: 0.5rem;
            }
            img.li-marker {
              width: ${listMarkerCssSize};
              height: ${listMarkerCssSize};
              margin: 0 0.5rem 0 0;
            }
            .li-marker::before {
              font-size: ${listMarkerCssSize};
              font-weight: 600;
              width: ${listMarkerCssSize};
              height: ${listMarkerCssSize};
            }
            /* 嵌套的 ul 内部，让缩进变量自动叠加 1rem */
            ul ul {
              --list-indent: calc(var(--list-indent, 1rem) + 1rem);
            }
            .li-row {
              display: inline-flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: baseline;
            }
            .li-row > img {
              margin: 0 0.5rem 0 0;
            }
            .li-row > a {
              text-decoration: none;
            }
          }
          @media (hover: hover) {
            .toc-wrapper .toc-title:hover {
              color: ${lightThemeHighlightColor};
              cursor: pointer;
            }
            html.dark .toc-wrapper .toc-title:hover {
              color: ${darkThemeHighlightColor};
            }
            .toc-wrapper .li-row:hover {
              color: ${lightThemeHighlightColor};
            }
            .toc-wrapper .li-row:hover > .li-marker::before {
              color: ${lightThemeHighlightColor};
            }
            .toc-wrapper .li-row:hover > a {
              color: ${lightThemeHighlightColor};
            }
            html.dark .toc-wrapper .li-row:hover {
              color: ${darkThemeHighlightColor};
            }
            html.dark .toc-wrapper .li-row:hover > .li-marker::before {
              color: ${darkThemeHighlightColor};
            }
            html.dark .toc-wrapper .li-row:hover > a {
              color: ${darkThemeHighlightColor};
            }
          }
          .toc-wrapper .toc-title:active {
            color: ${lightThemeHighlightColor};
            cursor: pointer;
          }
          html.dark .toc-wrapper .toc-title:active {
            color: ${darkThemeHighlightColor};
          }
          .toc-wrapper .li-row:active {
            color: ${lightThemeHighlightColor};
          }
          .toc-wrapper .li-row:active > .li-marker::before {
            color: ${lightThemeHighlightColor};
          }
          .toc-wrapper .li-row:active > a {
            color: ${lightThemeHighlightColor};
          }
          html.dark .toc-wrapper .li-row:active {
            color: ${darkThemeHighlightColor};
          }
          html.dark .toc-wrapper .li-row:active > .li-marker::before {
            color: ${darkThemeHighlightColor};
          }
          html.dark .toc-wrapper .li-row:active > a {
            color: ${darkThemeHighlightColor};
          }
        `;

        const iframeContent = `
          <iframe
            style="display:none;"
            srcdoc="&lt;!DOCTYPE html&gt;
              &lt;html&gt;
              &lt;head&gt;&lt;meta charset=&quot;utf-8&quot;&gt;&lt;/head&gt;
              &lt;body&gt;
                <script is:inline data-astro-rerun>
                  const currentLocale = window.parent.location.pathname.split('/')[1] || '${opt.locale || DEFALUT_LOCALE}';
                  const languageMap = ${opt.languageMap ? JSON.stringify(opt.languageMap).replaceAll('"', "'") : JSON.stringify(DEFAULT_LANGUAGE_MAP).replaceAll('"', "'")};

                  function syncTocTitle(
                    locale,
                    languageMap
                  ) {
                    const tocSummary = window.parent.document.querySelector('[data-satteri-toc-title]');

                    if (tocSummary) {
                      const titleKey = tocSummary.getAttribute('data-satteri-toc-title');
                      const translation =
                        languageMap[locale] || '${title}' || titleKey;
                      tocSummary.textContent = translation;
                    }
                  }

                  function toggleToc() {
                    const tocTitle = window.parent.document.querySelector('[data-satteri-toc-title]');
                    if (tocTitle) {
                      tocTitle.addEventListener('click', function () {
                        tocTitle.parentElement.classList.toggle('open');
                      })
                    }
                  }

                  window.addEventListener('load', function() {
                    if (window.parent.document.readyState === 'complete') {
                      syncTocTitle(currentLocale, languageMap);
                      toggleToc();
                    } else {
                      window.parent.document.addEventListener('readystatechange', event => {
                        if (event.target.readyState === 'complete') {
                          syncTocTitle(currentLocale, languageMap);
                          toggleToc();
                        }
                      });
                    }
                  });
                </script>
              &lt;/body&gt;
            &lt;/html&gt;">
          </iframe>
        `;

        const totalNodeStr = `
          <div class="toc-wrapper"><style>${
            baseStyle +
            (opt.globalStyle ?? "") +
            (opt.listMarkerType === "decimal" ||
            opt.listMarkerType === undefined
              ? `.toc-wrapper ul:has(> li) {
                  list-style-type: none;
                  counter-reset: toc-counter;
                }
                .toc-wrapper li {
                  counter-increment: toc-counter;
                }
                .toc-wrapper .li-marker::before {
                  content: counters(toc-counter, ".");
                }`
              : "") +
            (canCollapse
              ? `.toc-wrapper {
                  max-height: 2rem;
                }
                .toc-wrapper:has(.toc-title.open) {
                  max-height: 100vh;
                }
                `
              : "") +
            (opt.animation &&
            animation !== undefined &&
            typeof animation !== "boolean" &&
            canCollapse
              ? `.toc-wrapper {
                  transition: max-height ${animation.duration} ${animation.timingFunction};
                }`
              : "") +
            (opt.titleMarkerType !== "image"
              ? `
                .toc-wrapper .title-marker + span, .toc-wrapper > ul {
                  margin-left: 0.5rem;
                }
                .toc-wrapper .toc-title .title-marker::before {
                  content: '${closedMarker} ';
                  display: inline-block;
                  font-size: ${titleMarkerCssSize};
                  vertical-align: bottom;

                }
                .toc-wrapper .toc-title.open .title-marker::before {
                  content: '${openedMarker} ';
                  display: inline-block;
                  font-size: ${titleMarkerCssSize};
                  vertical-align: bottom;
                }
              `
              : "") +
            (opt.titleMarkerType === "image"
              ? `
                .toc-wrapper .title-marker {
                  display: inline-block;
                }
                .toc-wrapper .title-marker::before {
                  content: "";
                  background: url('${closedMarker}') center / contain no-repeat;
                  width: ${titleMarkerCssSize};
                  height: 100%;
                  display: inline-block;
                  margin-right: 0.3rem;
                  vertical-align: text-bottom;
                }
                .toc-wrapper .toc-title.open .title-marker::before {
                  content: "";
                  background: url('${openedMarker}') center / contain no-repeat;
                  width: ${titleMarkerCssSize};
                  height: 100%;
                  display: inline-block;
                  margin-right: 0.3rem;
                  vertical-align: text-bottom;
                }
              `
              : "")
          }</style><h2 class="toc-title ${opt.class?.title ?? ""}" style="${opt.style?.title ?? ""}"><span class="title-marker"></span><span data-satteri-toc-title="${title}">${title}</span></h2>${collectedNodeStr}${iframeContent}</div>
        `;

        if (firstHeading.headingIndex !== undefined) {
          ctx.replaceNode(root.children[firstHeading.headingIndex], {
            type: "raw",
            value:
              totalNodeStr +
              `<h${firstHeading.headingDepth} id="${firstHeading.headingId}">${firstHeading.headingText || ""}</h${firstHeading.headingDepth}>`,
          });
        }
      }
    },
  });
}

/**
 *
 * @param node 遍历的当前节点
 * @param opt 传入插件的配置
 * @returns 所有节点的html内容字符串
 */
function concatNodeStr(node: CUSTOM_NODE, opt: HastOption): string {
  let childNodeStr = "";
  if (node.children.length > 0) {
    for (let i = 0; i < node.children.length; i++) {
      childNodeStr += concatNodeStr(node.children[i], opt);
    }
    childNodeStr = `<ul class="${opt.class?.ul ?? ""}" style="${opt.style?.ul ?? ""}">${childNodeStr}</ul>`;
    return node.content + childNodeStr;
  }
  return node.content;
}
export default prettyToc;
