export function MarkdownText(props: { children: string }) {
  return Bun.markdown.react(props.children, {
    a(props) {
      return <a href={props.href} target="_blank">{props.children}</a>
    }
  })
}