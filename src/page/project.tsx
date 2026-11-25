import { MarkdownText, scrollbar, scrollbar__invs, scrollbar__vertical, page__rootStyle, ProjectHeader, ProjectSection, ProjectStatTable, BackToHomeButton, Show, ProjectItem, For } from "../components"
import { css } from "../core"
import { ProjectType, type AnyProjectStat, type IProjectGroupStat, type IProjectStat, type ProjectMetadataSchema } from "../api"
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

const page__subProjectList = css`
  padding-left: 0;
  
  & * {
    font-size: 1.52rem !important;
  }
`

export default function ProjectPage(props: AnyProjectStat) {
  return (
    <>
      <BackToHomeButton />
      <div id="root" class={`${page__rootStyle} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
        <ProjectHeader {...props} />
        <main class={`${page__main} ${GLOBAL_PROJECT_PAGE_INLINE_PADDING}`}>
          <Show when={props.description.length != 0}>
            <ProjectSection name="Basically">
              <MarkdownText>
                {props.longDescription}
              </MarkdownText>
            </ProjectSection>
          </Show>
          <Show when={props.projectType === ProjectType.PROJECT}>
            <ProjectSection name="Project stats" class={page__section}>
              <ProjectStatTable {...props as IProjectStat} />
            </ProjectSection>
          </Show>
          <Show when={props.projectType === ProjectType.GROUP}>
            <ProjectSection name="This group consist of..." class={page__section}>
              <ul class={page__subProjectList}>
                <For each={(props as IProjectGroupStat).projects}>
                  {(it, index) => (
                    <ProjectItem {...it} index={index + 1} />
                  )}
                </For>
              </ul>
            </ProjectSection>
          </Show>
        </main>
      </div>
    </>
  )
}