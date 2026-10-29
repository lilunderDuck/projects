import html2react from "html-react-parser"
// ...
import { css } from "../../core"
import { codeBlock__highlight, cursedCodeBlockParserWithLineNumbers, cursedRecursiveCodeBlockRenderer } from "./cursedCodeBlockParser"
import { highlighter } from "../../codeBlockBootstrap"

const codeBlock__root = css`
  background-color: var(--mantle);
  border-radius: 6px;
  white-space: break-spaces;
  margin-bottom: 10px;
  counter-reset: codeBlock;
`

export function MarkdownText(props: { children: string }) {
  return Bun.markdown.react(props.children, {
    a(props) {
      const urlEndsWithMarkdown = props.href.endsWith(".md")
      const modifiedUrl = urlEndsWithMarkdown ? props.href.replace(".md", ".html") : props.href
      return (
        <a 
          href={modifiedUrl} 
          target={urlEndsWithMarkdown ? "_self" : "_blank"}
        >
          {props.children}
        </a>
      )
    },
    // code block
    pre(props) {
      if (!props.language) return (
        <pre class={codeBlock__root}>{props.children}</pre>
      )

      const stringifiedChildren = props.children.join('')
      const HTML_CODE = highlighter.codeToHast(
        stringifiedChildren,
        { lang: props.language!, theme: "catppuccin-latte" }
      )

      const b = highlighter.codeToHtml(
        stringifiedChildren,
        { lang: props.language!, theme: "catppuccin-latte" }
      )
      const a = cursedRecursiveCodeBlockRenderer(HTML_CODE)
      console.log(a)
      console.log("===============================================")
      console.log(b)

      const codeLines = cursedCodeBlockParserWithLineNumbers()
      
      return (
        <pre class={`${codeBlock__root} ${codeBlock__highlight}`}>
          {codeLines}
        </pre>
      )
    }
  })
}