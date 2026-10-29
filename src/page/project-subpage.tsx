import { MarkdownText, scrollbar, scrollbar__invs, scrollbar__vertical, page__rootStyle, ProjectHeader, ProjectSection } from "../components"
import { css } from "../core"
import type { IProjectStat } from "../data"
import { GLOBAL_PROJECT_PAGE_INLINE_PADDING } from "../main"

const page__main = css`
  padding-bottom: 15rem;
`

export default function ProjectSubpage(props: {
  metadata: IProjectStat,
  page: IProjectStat["pages"][0]
}) {
  return (
    <div id="root" class={`${page__rootStyle} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
      <ProjectHeader {...props.metadata} />
      <main class={`${page__main} ${GLOBAL_PROJECT_PAGE_INLINE_PADDING}`}>
        <ProjectSection name="Some stuff">
          <MarkdownText>
            {props.page.content}
          </MarkdownText>
        </ProjectSection>
      </main>
    </div>
  )
}