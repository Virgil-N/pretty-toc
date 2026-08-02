import { defineHastPlugin } from "satteri";
import slug from "slug";

function prettyToc(option) {
  return defineHastPlugin({
    name: "prettyToc",
    element: [
      {
        filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
        // ctx: { data: Data } & HastVisitorContext
        visit(node, ctx) {
          const opt = option ?? {
            title: "Table of Contents",
            listStyle: "decimal", // disc, circle, decimal, none...
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
            locale: "zh-CN",
            languageMap: {
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
            },
          };

          try {
            const defaultTitle = "Table of Contents";
            const depth = parseInt(node.tagName.slice(-1), 10);
            const content = ctx.textContent(node);
            const contentSlug = slug(content) + new Date().getTime();

            const lightThemeHighlightColor =
              opt.lightThemeHighlightColor ?? "oklch(0.75 0.1229 12.71)";
            const darkThemeHighlightColor =
              opt.darkThemeHighlightColor ?? "oklch(0.81 0.1004 305.04)";

            let marker = "";
            let icon = "🍎";
            if (opt.icon && typeof opt.icon === "string") {
              icon = opt.icon;
            } else if (Array.isArray(opt.icon)) {
              icon = opt.icon[depth - 1] ?? "🍎";
            }
            switch (opt.listStyle) {
              case "icon":
                marker = `<span class='li-marker'>${icon}</span>`;
                break;
              case "image":
                marker = `${opt.image ? `<img class='li-marker' src="${opt.image}" alt='icon' />` : ""}`;
                break;
              case "decimal":
                marker = "<span class='li-marker'></span>";
                break;
              default:
                marker = "";
            }

            const nodeStr = `<li id="li-${contentSlug}" class="${opt.class?.li ?? ""}" style="${opt.style?.li ?? ""}" data-depth=${depth}><div class="li-row">${marker}<a href="#${contentSlug}" class="${opt.class?.a ?? ""}" style="${opt.style?.a ?? ""}">${content}</a></div><span data-depth='${depth}' style="display: none;"></span></li>`;

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
                summary:hover {
                  color: ${lightThemeHighlightColor};
                }
                html.dark summary:hover {
                  color: ${darkThemeHighlightColor};
                }
                ul {
                  padding-left: 0;
                  list-style-type: ${(opt.listStyle === "icon" || opt.listStyle === "image" || opt.listStyle === "decimal") ? "none" : opt.listStyle} ;
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
                  display: inline-block;
                  margin-right: 0.5rem;
                }
                img.li-marker {
                  width: ${opt.markerCssSize ?? "1rem"};
                  height: ${opt.markerCssSize ?? "1rem"};
                  margin: 0 0.5rem 0 0;
                }
                .li-marker::before {
                  font-size: 1rem;
                  font-weight: 600;
                  width: ${opt.markerCssSize ?? "1rem"};
                  height: ${opt.markerCssSize ?? "1rem"};
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
                }</style><details><summary data-satteri-toc-title="${opt.languageMap?.[opt.locale ?? "en-US"] ?? defaultTitle}" class="${opt.class?.summary ?? ""}" style="${opt.style?.summary ?? ""}">${opt.languageMap?.[opt.locale ?? "en-US"] ?? defaultTitle}</summary><ul class="${opt.class?.ul ?? ""}" style="${opt.style?.ul ?? ""}">${nodeStr}</ul>${scriptContent}</details>`;
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
}

export default prettyToc;
