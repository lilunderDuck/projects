import { css, MarkdownText, scrollbar, scrollbar__invs, scrollbar__vertical } from "../../core"
import { ImageOneItemView, page__rootStyle, ProjectHeader, ProjectSection, ProjectStatTable } from "../components"
import type { IProjectStat } from "../data"

const page__main = css`
  padding-inline: 4rem;
  padding-bottom: 15rem;
`

const page__section = css`
  margin-bottom: 20px;
  & > p:not(:last-child) {
    margin-bottom: 20px;
  }
`

const page__thisPreviewSection = css`
  padding-block: 20px;
  background-color: var(--mantle);
  border-radius: 6px;
`

const page__previewSection = css`
  height: 30rem;
  margin-inline: 20px;
  position: relative;
`

export default function ProjectPage(props: IProjectStat) {
  return (
    <div id="root" class={`${page__rootStyle} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
      <ProjectHeader {...props} />
      <main class={page__main}>
        <ProjectSection name="Basically">
          <MarkdownText>
            {props.longDescription}
          </MarkdownText>
        </ProjectSection>
        {props.previewImages && (
          <ProjectSection class={`${page__section} ${page__thisPreviewSection}`}>
            <div class={page__previewSection}>
              <ImageOneItemView images={props.previewImages} />
            </div>
          </ProjectSection>
        )}
        <ProjectSection name="Project stats" class={page__section}>
          <ProjectStatTable {...props} />
        </ProjectSection>
      </main>
    </div>
  )
}