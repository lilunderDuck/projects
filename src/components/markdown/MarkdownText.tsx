import html2react from "html-react-parser"
import Prism from "prismjs"
// ...
import { css } from "../../core"
import { cursedCodeBlockParserWithLineNumbers } from "./cursedCodeBlockParser"

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
      const HTML_CODE = Prism.highlight(
        stringifiedChildren, 
        // @ts-ignore
        Prism.languages[props.language!], 
        props.language!
      )

      const codeLines = cursedCodeBlockParserWithLineNumbers(html2react(HTML_CODE))

      return (
        <pre class={codeBlock__root}>
          {codeLines}
        </pre>
      )
    }
  })
}