import { css, MarkdownText, scrollbar, scrollbar__invs, scrollbar__vertical } from "../../core"
import { page__rootStyle, ProjectHeader } from "../components"
import type { IProjectStat } from "../data"

const page__main = css`
  padding-inline: 4rem;
  padding-bottom: 15rem;
`

export default function ProjectSubpage(props: IProjectStat) {
  return (
    <div id="root" class={`${page__rootStyle} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
      <ProjectHeader {...props} />
      <main class={page__main}>
        <MarkdownText>
          {''}
        </MarkdownText>
      </main>
    </div>
  )
}