import { defineHastPlugin } from "satteri";
import slug from "slug";

const prettyToc = (opt) =>
  defineHastPlugin({
    name: "prettyToc",
    element: [
      {
        filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
        // ctx: { data: Data } & HastVisitorContext
        visit(node, ctx) {
          try {
            const defaultTitle = "Table of Contents";
            const depth = parseInt(node.tagName.slice(-1), 10);
            const content = ctx.textContent(node);
            const contentSlug = slug(content) + new Date().getTime();

            const lightThemeHighlightColor =
              opt.lightThemeHighlightColor ?? "oklch(0.75 0.1229 12.71)";
            const darkThemeHighlightColor =
              opt.darkThemeHighlightColor ?? "oklch(0.81 0.1004 305.04)";

            const nodeStr = `<li id="li-${contentSlug}" class="${opt.class?.li ?? ""}" style="${opt.style?.li ?? ""}" data-depth=${depth}><div class="li-row">${opt.listStyle === "decimal" ? "<span class='li-marker'></span>" : ""}<a href="#${contentSlug}" class="${opt.class?.a ?? ""}" style="${opt.style?.a ?? ""}">${content}</a></div><span data-depth='${depth}' style="display: none;"></span></li>`;

            ctx.setProperty(node, "id", contentSlug);

            if (ctx.data.nodeStr === undefined) {
              const baseStyle = `
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                summary {
                  font-size: 1.25rem;
                  margin-bottom: 0.5rem;
                }
                ul {
                  padding-left: 0;
                  list-style-type: ${opt.listStyle === "decimal" ? "none" : opt.listStyle} ;
                  list-style-position: inside;
                }
                li {
                  /* 默认缩进为 1rem */
                  padding-left: var(--list-indent, 1rem);
                  line-height: 1.5rem;
                  font-size: 1rem;
                  animation: fadeIn 0.1s ease-in; // 防止页面刷新瞬间显示"0 javascript"
                }
                .li-marker {
                  margin-right: 0.5rem;
                }
                .li-marker::before {
                  font-size: 1rem;
                  font-weight: 600;
                }
                /* 嵌套的 ul 内部，让缩进变量自动叠加 1rem */
                ul ul li {
                  --list-indent: calc(var(--list-indent, 1rem) + 1rem);
                }
                .li-row {
                  display: inline-block;
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
              `;

              const scriptContent = `<script is:inline data-astro-rerun>
                // 加上{}块级作用域，防止报错
                {
                  const currentLocale = window.location.pathname.split('/')[1] || 'en-US';
                  const languageMap = ${JSON.stringify(opt.languageMap)};

                  function syncTocTitle(
                    locale,
                    languageMap
                  ) {
                    const tocSummary = document.querySelector("[data-satteri-toc-title]");

                    if (tocSummary) {
                      const titleKey = tocSummary.getAttribute("data-satteri-toc-title");
                      const translation =
                        languageMap[locale] || titleKey || defaultTitle;
                      tocSummary.textContent = translation;
                    }
                  }

                  syncTocTitle(currentLocale, languageMap);

                  window.addEventListener("load", () => {
                    syncTocTitle(currentLocale, languageMap);
                  });
                }
              </script>`;
              ctx.data.firstHeading = node;
              ctx.data.firstHeadingDepth = depth;
              ctx.data.firstHeadingId = contentSlug;
              ctx.data.rootNode = ctx.parent(node);
              ctx.data.nodeStr = `<style>${baseStyle +
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
                  : "")
                }</style><details><summary data-satteri-toc-title="${opt.languageMap?.[opt.locale ?? defaultTitle] ?? defaultTitle}" class="${opt.class?.summary ?? ""}" style="${opt.style?.summary ?? ""}">${opt.languageMap?.[opt.locale ?? "en-US"] ?? defaultTitle}</summary><ul class="${opt.class?.ul ?? ""}" style="${opt.style?.ul ?? ""}">${nodeStr}</ul>${scriptContent}</details>`;
            } else {
              const indexA = ctx.data.nodeStr?.lastIndexOf(
                `<span data-depth='${depth}' style="display: none;"></span>`,
              );
              if (indexA !== -1) {
                ctx.data.nodeStr =
                  ctx.data.nodeStr?.slice(0, indexA + 56) +
                  nodeStr +
                  ctx.data.nodeStr?.slice(indexA + 56);
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

            // 处理标题不在顶层的情况(比如在一个section标签内)
            let parent = ctx.parent(node);
            while (parent.type !== "root" && parent !== undefined) {
              const p = ctx.parent(parent);
              if (p) {
                parent = p;
              } else {
                break;
              }
            }
            // 替换toc
            ctx.replaceNode(parent.children[0], {
              type: "raw",
              value:
                ctx.data.nodeStr +
                `<h${ctx.data.firstHeadingDepth
                } id="${ctx.data.firstHeadingId}">${ctx.data.firstHeading && ctx.textContent(ctx.data.firstHeading)}</h${ctx.data.firstHeadingDepth
                }>`,
            });
          } catch (err) {
            console.log("解析处理节点失败: ", err);
          }
        },
      },
    ],
  });

export default prettyToc;
