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
      openedMarker: '🦋',
      closedMarker: '🐢',
      titleMarkerType: 'icon',
      titleMarkerCssSize: '1.5rem',
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
      liMarkerCssSize: "1rem",
      lightThemeHighlightColor: "oklch(0.75 0.1229 12.71)",
      darkThemeHighlightColor: "oklch(0.81 0.1004 305.04)",
      animation: {
        duration: '0.8s',
        timingFunction: 'ease-in-out'
      },
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

|Property‌|Type|Default Value|Preset Value|Info|
|:---|:---|:---|:---|:--|
|title|string|Table of Contents|Table of Contents|-|
|openedMarker|string or undefined|undefined|▼|titleMarkerType must already be set.|
|closedMarker|string or undefined|undefined|▶︎|titleMarkerType must already be set.|
|titleMarkerType|string or undefined|undefined|icon|Value can only be "icon" or "image".|
|titleMarkerCssSize|string or undefined|undefined|fit-content|-|
|listStyle|string or undefined|undefined|decimal|eg. disc, circle, decimal, none... or icon and image|
|icon|string or string[] or undefined|undefined|decimal|listStyle must already be set.|
|image|string or string[] or undefined|undefined|404 image|listStyle must already be set.|
|liMarkerCssSize|string or undefined|undefined|1.5rem|CSS property value|
|lightThemeHighlightColor|string or undefined|undefined|oklch(0.75 0.1229 12.71)|-|
|darkThemeHighlightColor|string or undefined|undefined|oklch(0.81 0.1004 305.04)|-|
|animation|boolean or { duration: string, timingFunction: string } or undefined|undefined|{ duration: "0.8s", timingFunction: 'ease-in-out' }|-|
|class|{summary?: string, ul?: string, li?: string, a?: string} or or undefined|undefined|undefined|eg. {summary: "pb-2", li: "py-1"}|
|globalStyle|string or or undefined|undefined|undefined|eg. "summary {background-color: yellow;}"|
|style|Object{summary?: string, ul?: string, li?: string, a?: string} or or undefined|undefined|undefined|eg. {a: "font-style: italic;"}|
|locale|string or undefined|undefined|en-US|eg. "zh-CN" // **Note: The case of the locale variable should match the locale in your page URL.**|
|languageMap|Record<string, string> or undefined|undefined|{"de-DE": "Inhaltsverzeichnis","el-GR": "Περιεχόμενα","en-US": "Contents","es-ES": "Índice","fr-FR": "Sommaire","it-IT": "Indice","ja-JP": "目次","ko-KR": "목차","ru-RU": "Оглавление","th-TH": "สารบัญ","tr-TR": "İçindekiler","zh-CN": "目录","zh-Hant": "目錄"}|eg. {"en-US": "Table of Contents", "ja-JP": "目次"}|
