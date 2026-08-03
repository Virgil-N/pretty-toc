A Table of Contents generation plugin for the Satteri markdown parser library.

## Install

```
npm install pretty-toc --save-dev
```

## Example

```javascript
import prettyToc from 'pretty-toc';

// example
satteri({
  hastPlugins: [prettyToc({title: "Table of Contents", listStyle: "decimal"})]
})

// Full example
processor: satteri({
  hastPlugins: [
    prettyToc({
      title: "Table of Contents",
      listStyle: "image", // disc, circle, decimal, none... icon, image...
      icon: ["🐶", "🦁", "🐷", "🐸", "🐥", "🐞"], // or just a string, eg. "🐥"
      image: [
        "/svg/unjs--automd.svg",
        "/svg/unjs--hookable.svg",
        "/svg/unjs--knitwork.svg",
        "/svg/unjs--mongoz.svg",
        "/svg/unjs--ofetch.svg",
        "/svg/unjs--uncrypto.svg",
      ], // or just a string, eg. "/svg/unjs--automd.svg"
      markerCssSize: "1rem",
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
      locale: "zh-CN", // Note: The case of the locale variable should match the locale in your page URL.
      languageMap: {
        "de-DE": "Inhaltsverzeichnis",
        "el-GR": "Περιεχόμενα",
        "en-US": "Table of Contents",
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
    }),
  ],
}),
```

## options

|Property‌|Type|Info|
|:---|:---|:---|
|title|string|-|
|listStyle|string|eg. disc, circle, decimal, none... or icon and image|
|icon|string or string[]|-|
|image|string or string[]|-|
|markerCssSize|string|CSS property value|
|lightThemeHighlightColor|string|eg. "oklch(0.75 0.1229 12.71)"|
|darkThemeHighlightColor|string|eg. "oklch(0.81 0.1004 305.04)"|
|class|{summary?: string, ul?: string, li?: string, a?: string}|eg. {summary: "pb-2", li: "py-1"}|
|globalStyle|string|eg. "summary {background-color: yellow;}"|
|style|Object{summary?: string, ul?: string, li?: string, a?: string}|eg. {a: "font-style: italic;"}|
|locale|string|eg. "zh-CN" // **Note: The case of the locale variable should match the locale in your page URL.**|
|languageMap|Record<string, string>|eg. {"en-US": "Table of Contents", "ja-JP": "目次"}|
