import { defineHastPlugin, type HastVisitorContext, type HastPluginDefinition } from "satteri";
import {
  DEFAULT_OPTIONS,
  DEFAULT_TITLE,
  DEFAULT_OPENED_TITLE_MARKER,
  DEFAULT_CLOSED_TITLE_MARKER,
  DEFAULT_TITLE_MARKER_CSS_SIZE,
  DEFAULT_LI_MARKER_CSS_SIZE,
  DEFALUT_LOCALE,
  DEFAULT_ANIMATION,
  DEFAULT_LIGHT_THEME_HIGHLIGHT_COLOR,
  DEFAULT_DARK_THEME_HIGHLIGHT_COLOR,
  DEFAULT_LANGUAGE_MAP,
  DEFAULT_LIST_STYLE
} from "./const";
import type { Data, HastOption } from "../basic";
import notFoundImg from "./assets/svg/image-not-found.svg";
import slug from "slug";

function prettyToc(option?: HastOption): HastPluginDefinition {
  return defineHastPlugin({
    name: "prettyToc",
    element: [
      {
        filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
        visit(node, ctx: { data: Data } & HastVisitorContext) {
          const opt = option ?? DEFAULT_OPTIONS;

          try {
            const depth = parseInt(node.tagName.slice(-1), 10);
            const content = ctx.textContent(node);
            const contentSlug = slug(content) + new Date().getTime();

            let title = opt.title || DEFAULT_TITLE

            if (opt.languageMap) {
              title = opt.languageMap[opt.locale ?? DEFALUT_LOCALE] || DEFAULT_TITLE;
            } else {
              title = DEFAULT_LANGUAGE_MAP[opt.locale ?? DEFALUT_LOCALE] || DEFAULT_TITLE;
            }

            let listStyle = DEFAULT_LIST_STYLE;

            if (opt.listStyle === "icon" || opt.listStyle === "image" || opt.listStyle === "decimal") {
              listStyle = "none";
            } else if (opt.listStyle !== undefined) {
              listStyle = opt.listStyle;
            }

            const lightThemeHighlightColor =
              opt.lightThemeHighlightColor || DEFAULT_LIGHT_THEME_HIGHLIGHT_COLOR;
            const darkThemeHighlightColor =
              opt.darkThemeHighlightColor || DEFAULT_DARK_THEME_HIGHLIGHT_COLOR;
            const titleMarkerCssSize = opt.titleMarkerCssSize || DEFAULT_TITLE_MARKER_CSS_SIZE;
            const openedMarker = opt.openedMarker || DEFAULT_OPENED_TITLE_MARKER;
            const closedMarker = opt.closedMarker || DEFAULT_CLOSED_TITLE_MARKER;
            const liMarkerCssSize = opt.liMarkerCssSize || DEFAULT_LI_MARKER_CSS_SIZE;

            let animation = undefined;

            if (typeof opt.animation === "object" && opt.animation !== undefined) {
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

            switch (opt.listStyle) {
              case "icon":
                marker = `<span class='li-marker'>${icon}</span>`;
                break;
              case "image":
                marker = `<img class='li-marker' src="${image}" alt='icon' />`;
                break;
              case "decimal":
                marker = "<span class='li-marker'></span>";
                break;
              default:
                marker = "";
            }

            const tagSignal = `<span data-depth='${depth}' style="display: none;"></span>`;
            const tagSignalLength = tagSignal.length;

            const nodeStr = `<li id="li-${contentSlug}" class="${opt.class?.li ?? ""}" style="${opt.style?.li ?? ""}" data-depth=${depth}><div class="li-row">${marker}<a href="#${contentSlug}" class="${opt.class?.a ?? ""}" style="${opt.style?.a ?? ""}">${content}</a></div>${tagSignal}</li>`;

            ctx.setProperty(node, "id", contentSlug);

            // 处理标题不在顶层的情况(比如在一个section标签内)
            let parent = ctx.parent(node);
            while (parent.type !== "root" && parent !== undefined) {
              const p = ctx.parent(parent);
              if (p) {
                parent = p;
              } else break;
            }

            if (ctx.data.nodeStr === undefined) {
              const baseStyle = `
                .toc-wrapper {
                  display: grid;
                  grid-template-rows: 0fr;
                  overflow: hidden;
                }
                .toc-wrapper:has(.toc-title.open) {
                  grid-template-rows: 1fr;
                }
                .toc-title {
                  font-size: 1.2rem;
                  font-weight: 600;
                  margin: 0 0 0.5rem 0;
                  width: fit-content;
                  position: relative;
                }
                ul {
                  padding-left: 0;
                  list-style-type: ${listStyle} ;
                  list-style-position: inside;
                }
                .toc-wrapper > ul {
                  margin-left: 0.5rem;
                }
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                li {
                  /* 默认缩进为 1rem */
                  padding-left: var(--list-indent, 1rem);
                  line-height: 1.5rem;
                  font-size: 1rem;
                  animation: fadeIn 0.01s ease-in; // 防止页面刷新瞬间显示"0 javascript"
                }
                .li-marker {
                  display: inline-block;
                  margin-right: 0.5rem;
                }
                img.li-marker {
                  width: ${liMarkerCssSize};
                  height: ${liMarkerCssSize};
                  margin: 0 0.5rem 0 0;
                }
                .li-marker::before {
                  font-size: 1rem;
                  font-weight: 600;
                  width: ${liMarkerCssSize};
                  height: ${liMarkerCssSize};
                }
                /* 嵌套的 ul 内部，让缩进变量自动叠加 1rem */
                ul ul li {
                  --list-indent: calc(var(--list-indent, 1rem) + 1rem);
                }
                .li-row {
                  display: inline-flex;
                  flex-direction: row;
                  justify-content: flex-start;
                  align-items: center;
                }
                .li-row > img {
                  margin: 0 0.5rem 0 0;
                }
                .li-row > a {
                  text-decoration: none;
                }
                @media (hover: hover) {
                  .toc-title:hover {
                    color: ${lightThemeHighlightColor};
                    cursor: pointer;
                  }
                  html.dark .toc-title:hover {
                    color: ${darkThemeHighlightColor};
                  }
                  .li-row:hover {
                    color: ${lightThemeHighlightColor};
                  }
                  .li-row:hover > .li-marker::before {
                    color: ${lightThemeHighlightColor};
                  }
                  .li-row:hover > a {
                    color: ${lightThemeHighlightColor};
                  }
                  html.dark .li-row:hover {
                    color: ${darkThemeHighlightColor};
                  }
                  html.dark .li-row:hover > .li-marker::before {
                    color: ${darkThemeHighlightColor};
                  }
                  html.dark .li-row:hover > a {
                    color: ${darkThemeHighlightColor};
                  }
                }
                .toc-title:active {
                  color: ${lightThemeHighlightColor};
                  cursor: pointer;
                }
                html.dark .toc-title:active {
                  color: ${darkThemeHighlightColor};
                }
                .li-row:active {
                  color: ${lightThemeHighlightColor};
                }
                .li-row:active > .li-marker::before {
                  color: ${lightThemeHighlightColor};
                }
                .li-row:active > a {
                  color: ${lightThemeHighlightColor};
                }
                html.dark .li-row:active {
                  color: ${darkThemeHighlightColor};
                }
                html.dark .li-row:active > .li-marker::before {
                  color: ${darkThemeHighlightColor};
                }
                html.dark .li-row:active > a {
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
                        const languageMap = ${JSON.stringify(opt.languageMap).replaceAll('"', "'")} || ${JSON.stringify(DEFAULT_LANGUAGE_MAP).replaceAll('"', "'")};

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
                          const tocTitle = window.parent.document.querySelector('.toc-title');
                          if (tocTitle) {
                            tocTitle.addEventListener('click', function () {
                              tocTitle.classList.toggle('open');
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

              ctx.data.firstHeading = node;
              ctx.data.firstHeadingDepth = depth;
              ctx.data.firstHeadingId = contentSlug;
              ctx.data.firstHeadingIndex = ctx.indexOf(node) ?? 0;

              ctx.data.nodeStr = `
                <div class="toc-wrapper"><style>${baseStyle +
                (opt.globalStyle ?? "") +
                (opt.listStyle === "decimal"
                  ? `ul{
                        list-style-type: none;
                        counter-reset: toc-counter;
                      }
                      li {
                        counter-increment: toc-counter;
                      }
                      .li-marker::before {
                        content: counters(toc-counter, ".");
                      }`
                  : "") +
                (opt.animation && animation !== undefined ?
                  `.toc-wrapper {
                        max-height: 2rem;
                        transition: max-height ${animation.duration} ${animation.timingFunction};
                      }
                      .toc-wrapper:has(.toc-title.open) {
                        max-height: 100vh;
                      }
                      ` : "") +
                (opt.titleMarkerType === "icon" ?
                  `
                      .toc-title::before {
                        content: '${closedMarker} ';
                        display: contents;
                        font-size: 1rem;
                      }
                      .toc-title.open::before {
                        content: '${openedMarker} ';
                        display: contents;
                        font-size: 1rem;
                      }
                    ` : "") +
                (opt.titleMarkerType === "image" ?
                  `
                      .toc-wrapper > .toc-title, .toc-wrapper > ul {
                        margin-left: 2rem;
                      }
                      .toc-title::before {
                        content: "";
                        background: url('${closedMarker}') center / contain no-repeat;
                        width: ${titleMarkerCssSize};
                        height: ${titleMarkerCssSize};
                        position: absolute;
                        left: -2rem;
                        top: 50%;
                        transform: translateY(-50%);
                      }
                      .toc-title.open::before {
                        content: "";
                        background: url('${openedMarker}') center / contain no-repeat;
                        width: ${titleMarkerCssSize};
                        height: ${titleMarkerCssSize};
                        position: absolute;
                        left: -2rem;
                        top: 50%;
                        transform: translateY(-50%);
                      }
                    ` : "")
                }</style><h2 data-satteri-toc-title="${title}" class="toc-title ${opt.class?.title ?? ""}" style="${opt.style?.title ?? ""}">${title}</h2><ul class="${opt.class?.ul ?? ""}" style="${opt.style?.ul ?? ""}">${nodeStr}</ul>${iframeContent}</div>
              `;
            } else {
              const indexA = ctx.data.nodeStr?.lastIndexOf(tagSignal);
              if (indexA !== -1) {
                ctx.data.nodeStr =
                  ctx.data.nodeStr?.slice(0, indexA + tagSignalLength + 5) +
                  nodeStr +
                  ctx.data.nodeStr?.slice(indexA + tagSignalLength + 5);
              } else {
                if (depth > 1) {
                  let indexB = -1;
                  for (let i = depth; i > 0; i--) {
                    indexB = ctx.data.nodeStr?.lastIndexOf(
                      `<span data-depth='${i}' style="display: none;"></span>`,
                    );
                    if (indexB !== -1) {
                      break;
                    }
                  }
                  if (indexB !== -1) {
                    ctx.data.nodeStr =
                      ctx.data.nodeStr?.slice(0, indexB) +
                      `<ul class="${opt.class?.ul ?? ""}" style="${opt.style?.ul ?? ""}">` +
                      nodeStr +
                      `</ul>` +
                      ctx.data.nodeStr?.slice(indexB);
                  } else {
                    const indexC = ctx.data.nodeStr?.lastIndexOf(`</ul>`);
                    if (indexC !== -1) {
                      ctx.data.nodeStr =
                        ctx.data.nodeStr?.slice(0, indexC) +
                        nodeStr +
                        ctx.data.nodeStr?.slice(indexC);
                    } else {
                      // 没有ul结尾标签？不可能！
                    }
                  }
                } else {
                  const indexB = ctx.data.nodeStr?.lastIndexOf(`</ul>`);
                  if (indexB !== -1) {
                    ctx.data.nodeStr =
                      ctx.data.nodeStr?.slice(0, indexB) +
                      nodeStr +
                      ctx.data.nodeStr?.slice(indexB);
                  }
                }
              }
            }

            // 替换toc
            if (parent.type === "root") {
              ctx.replaceNode(parent.children[ctx.data.firstHeadingIndex], {
                type: "raw",
                value:
                  ctx.data.nodeStr +
                  `<h${ctx.data.firstHeadingDepth} id="${ctx.data.firstHeadingId}">${ctx.data.firstHeading && ctx.textContent(ctx.data.firstHeading)}</h${ctx.data.firstHeadingDepth}>`,
              });
            }
          } catch (err) {
            throw err;
          }
        },
      },
    ],
  });
}

export default prettyToc;
