import fs from "node:fs"
import type { JSX } from "react"
import path from "node:path"
// ...
import { recursivelyRenderJSXFast } from "./renderReactElement"

declare global {
  // only be used for its jsx types
  namespace React {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // patch: add class attribute, because we absolutely can
      // (since we don't care anything about reactive stuff and just a static site)
      class?: string
      // patch: patching out the 'style' attribute so I can directly write
      // CSS properties in string.
      // @ts-ignore - duplicated declaration, but we can ignore it.
      style?: CSSProperties | undefined | string
    }
  }
}

export interface IRenderHtmlOption {
  title: string
  description?: string
  /**Additional CSS (e.g global styles) to the page */
  css?: string
  bodyClass?: string
  basePath?: string
}

export function render(component: JSX.Element, to: string, withOptions?: IRenderHtmlOption) {
  withOptions = {
    description: "Tracking which weird project duck is currently doing",
    title: "Duck's project index",
    basePath: ".",
    ...withOptions,
  }

  const NO_FLASHBANG_WORKAROUND = `
    <style data-why="prevent flashbang when reload/open this">
      html {background-color: #11111b}
    </style>
  `

  const BASE_STYLE_PATH = `${withOptions.basePath}/assets/base.css` as const
  const GENERATED_CSS_STYLE_PATH = `${withOptions.basePath}/assets/orbital_precision_strike.css`

  fs.mkdirSync(path.dirname(to), { recursive: true })

  const HTML_MARKUP = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>${withOptions.title}</title>
        <link rel="stylesheet" href="${BASE_STYLE_PATH}">
        <link rel="stylesheet" href="${GENERATED_CSS_STYLE_PATH}">
        <meta name="description" content="${withOptions.description}">
        <meta name="duck" content="this is duck">
        ${NO_FLASHBANG_WORKAROUND}
        <style data-inline>${`${withOptions.css ?? ""}`.trim()}</style>
      </head>
      <body${withOptions.bodyClass ? ` class="${withOptions.bodyClass}"` : ""}>
        <!-- You won't believe this is not using react -->
        ${recursivelyRenderJSXFast(component)}
      </body>
    </html>
  `

  fs.writeFileSync(to, HTML_MARKUP)
}