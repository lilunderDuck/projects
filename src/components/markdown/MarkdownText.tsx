import html2react from "html-react-parser"
import { css } from "../../core"
import { cursedRecursiveCodeBlockRenderer } from "./cursedCodeBlockParser"
import { highlighter } from "../../codeBlockBootstrap"

const codeBlock__root = css`
  background-color: var(--mantle);
  border-radius: 6px;
  white-space: break-spaces;
  overflow-wrap: break-word;
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
      const HTML_CODE = cursedRecursiveCodeBlockRenderer(highlighter.codeToHast(
        stringifiedChildren,
        { lang: props.language!, theme: "catppuccin-frappe" }
      ))

      // const codeLines = cursedCodeBlockParserWithLineNumbers(html2react(HTML_CODE))
      const codeLines = html2react(HTML_CODE)
      
      return (
        <pre class={codeBlock__root}>
          {codeLines}
        </pre>
      )
    }
  })
}