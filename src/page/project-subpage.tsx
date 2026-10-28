import { css, MarkdownText, scrollbar, scrollbar__invs, scrollbar__vertical } from "../../core"
import { page__rootStyle, ProjectHeader, ProjectSection } from "../components"
import type { IProjectStat } from "../data"

const page__main = css`
  padding-inline: 4rem;
  padding-bottom: 15rem;
`

export default function ProjectSubpage(props: {
  metadata: IProjectStat,
  page: IProjectStat["pages"][0]
}) {
  return (
    <div id="root" class={`${page__rootStyle} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
      <ProjectHeader {...props.metadata} />
      <main class={page__main}>
        <ProjectSection name="Some stuff">
          <MarkdownText>
            {props.page.content}
          </MarkdownText>
        </ProjectSection>
      </main>
    </div>
  )
}