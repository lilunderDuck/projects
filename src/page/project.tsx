import { MarkdownText, scrollbar, scrollbar__invs, scrollbar__vertical, page__rootStyle, ProjectHeader, ProjectSection, ProjectStatTable } from "../components"
import { css } from "../core"
import type { IProjectStat } from "../data"
import { GLOBAL_PROJECT_PAGE_INLINE_PADDING } from "../main"

const page__main = css`
  padding-bottom: 15rem;
`

const page__section = css`
  margin-bottom: 20px;
  & > p:not(:last-child) {
    margin-bottom: 20px;
  }
`

export const PROJECT_PAGE_ROOT_CLASSES = `${page__rootStyle} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`

export default function ProjectPage(props: IProjectStat) {
  return (
    <>
      <ProjectHeader {...props} />
      <main class={`${page__main} ${GLOBAL_PROJECT_PAGE_INLINE_PADDING}`}>
        <ProjectSection name="Basically">
          <MarkdownText>
            {props.longDescription}
          </MarkdownText>
        </ProjectSection>
        <ProjectSection name="Project stats" class={page__section}>
          <ProjectStatTable {...props} />
        </ProjectSection>
      </main>
    </>
  )
}