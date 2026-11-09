[![CodeQL Advanced](https://github.com/Virgil-N/pretty-toc/actions/workflows/codeql.yml/badge.svg)](https://github.com/Virgil-N/pretty-toc/actions/workflows/codeql.yml)
[![GitHub Advanced Security](https://github.com/Virgil-N/pretty-toc/actions/workflows/agents/github-advanced-security/badge.svg)](https://github.com/Virgil-N/pretty-toc/actions/workflows/agents/github-advanced-security)
[![Verify and Release](https://github.com/Virgil-N/pretty-toc/actions/workflows/verify-and-release.yml/badge.svg)](https://github.com/Virgil-N/pretty-toc/actions/workflows/verify-and-release.yml)
![GitHub repo size](https://img.shields.io/github/repo-size/Virgil-N/pretty-toc)
![NPM Downloads](https://img.shields.io/npm/dm/pretty-toc)
![NPM Downloads](https://img.shields.io/npm/d18m/pretty-toc)
![GitHub License](https://img.shields.io/github/license/Virgil-N/pretty-toc)

A Table of Contents generation plugin for the Satteri markdown parser library.

## Install

```
// install with npm
npm install pretty-toc --save-dev

// install with pnpm
pnpm install pretty-toc --save-dev

// install with yarn
yarn add -D pretty-toc

// install with bun
bun add -D pretty-toc

// install with deno
deno add -D pretty-toc
```

## Table of Contents

- [Example](#Example)
- [Screenshots](#Screenshots)
- [Options](#Options)
- [Contribution](#Contribution)

## Screenshots

- icon
  ![](https://github.com/Virgil-N/resource/blob/main/image/pretty-toc/with-icon.png)

- image
  ![](https://github.com/Virgil-N/resource/blob/main/image/pretty-toc/with-image.png)

- dot
  ![](https://github.com/Virgil-N/resource/blob/main/image/pretty-toc/use-dot.png)

- decimal
  ![](https://github.com/Virgil-N/resource/blob/main/image/pretty-toc/use-decimal.png)

- nested image
  ![](https://github.com/Virgil-N/resource/blob/main/image/pretty-toc/use-multiple-image.png)

## Example

```javascript
import prettyToc from 'pretty-toc';

// Basic example
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
      titleMarkerCssSize: '1rem',
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
        title: "",
        ul: "",
        li: "",
        a: "",
      },
      globalStyle: "",
      style: {
        title: "",
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

<details id="Screenshots">
  <summary>Screenshots</summary>
  <ol>
    <li>
      <p>icon</p>
      <img src="https://github.com/Virgil-N/resource/blob/main/image/pretty-toc/with-icon.png" />
    </li>
    <li>
      <p>image</p>
      <img src="https://github.com/Virgil-N/resource/blob/main/image/pretty-toc/with-image.png" />
    </li>
    <li>
      <p>dot</p>
      <img src="https://github.com/Virgil-N/resource/blob/main/image/pretty-toc/use-dot.png" />
    </li>
    <li>
      <p>decimal</p>
      <img src="https://github.com/Virgil-N/resource/blob/main/image/pretty-toc/use-decimal.png" />
    </li>
    <li>
      <p>nested image</p>
      <img src="https://github.com/Virgil-N/resource/blob/main/image/pretty-toc/use-multiple-image.png" />
    </li>
  </ol>
</details>

## Options

| Property‌                | Type                                                                         | Default Value     | Preset Value                                                                                                                                                                                                                                                        | Description                                                                                        |
| :----------------------- | :--------------------------------------------------------------------------- | :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------- |
| title                    | string                                                                       | Table of Contents | Table of Contents                                                                                                                                                                                                                                                   | -                                                                                                  |
| openedMarker             | string or undefined                                                          | undefined         | ▼                                                                                                                                                                                                                                                                   | _**Note: titleMarkerType must already be set.**_                                                   |
| closedMarker             | string or undefined                                                          | undefined         | ▶︎                                                                                                                                                                                                                                                                   | _**Note: titleMarkerType must already be set.**_                                                   |
| titleMarkerType          | string or undefined                                                          | undefined         | icon                                                                                                                                                                                                                                                                | Value can only be "icon" or "image".                                                               |
| titleMarkerCssSize       | string or undefined                                                          | undefined         | fit-content                                                                                                                                                                                                                                                         | -                                                                                                  |
| listStyle                | string or undefined                                                          | undefined         | decimal                                                                                                                                                                                                                                                             | eg. disc, circle, decimal, none... or icon and image                                               |
| icon                     | string or string[] or undefined                                              | undefined         | decimal                                                                                                                                                                                                                                                             | _**Note: listStyle must already be set.**_                                                         |
| image                    | string or string[] or undefined                                              | undefined         | 404 image                                                                                                                                                                                                                                                           | _**Note: listStyle must already be set.**_                                                         |
| liMarkerCssSize          | string or undefined                                                          | undefined         | 1rem                                                                                                                                                                                                                                                                | CSS property value                                                                                 |
| lightThemeHighlightColor | string or undefined                                                          | undefined         | oklch(0.75 0.1229 12.71)                                                                                                                                                                                                                                            | -                                                                                                  |
| darkThemeHighlightColor  | string or undefined                                                          | undefined         | oklch(0.81 0.1004 305.04)                                                                                                                                                                                                                                           | -                                                                                                  |
| animation                | boolean or { duration: string, timingFunction: string } or undefined         | undefined         | { duration: "0.8s", timingFunction: 'ease-in-out' }                                                                                                                                                                                                                 | -                                                                                                  |
| class                    | {title?: string, ul?: string, li?: string, a?: string} or or undefined       | undefined         | undefined                                                                                                                                                                                                                                                           | eg. {li: "py-1"}                                                                                   |
| globalStyle              | string or or undefined                                                       | undefined         | undefined                                                                                                                                                                                                                                                           | eg. "ul {background-color: yellow;}"                                                               |
| style                    | Object{title?: string, ul?: string, li?: string, a?: string} or or undefined | undefined         | undefined                                                                                                                                                                                                                                                           | eg. {a: "font-style: italic;"}                                                                     |
| locale                   | string or undefined                                                          | undefined         | en-US                                                                                                                                                                                                                                                               | eg. "zh-CN" // **Note: The case of the locale variable should match the locale in your page URL.** |
| languageMap              | Record<string, string> or undefined                                          | undefined         | {"de-DE": "Inhaltsverzeichnis","el-GR": "Περιεχόμενα","en-US": "Contents","es-ES": "Índice","fr-FR": "Sommaire","it-IT": "Indice","ja-JP": "目次","ko-KR": "목차","ru-RU": "Оглавление","th-TH": "สารบัญ","tr-TR": "İçindekiler","zh-CN": "目录","zh-Hant": "目錄"} | eg. {"en-US": "Table of Contents", "ja-JP": "目次"}                                                |

## Contribution

If you see any errors or room for improvement on this plugin, feel free to open an [issues](https://github.com/Virgil-N/pretty-toc/issues) or [pull request](https://github.com/Virgil-N/pretty-toc/pulls) . Thank you in advance for contributing!
