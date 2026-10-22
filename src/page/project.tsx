import { css, MarkdownText, scrollbar, scrollbar__invs, scrollbar__vertical } from "../../core"
import { ImageOneItemView, ProjectSection, ProjectStatTable } from "../components"
import type { IProjectStat } from "../data"

const page__root = css`
  user-select: none;
  overflow-y: auto;
  & p {
    font-size: 1.5rem;
  }

  & h2 {
    font-size: 2.3rem;
  }

  & h1 {
    font-size: 2.375rem;
  }
`

const page__header = css`
  width: 100%;
  height: 24rem;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--mantle);
  margin-bottom: 10px;
  position: relative;
`

const page__headerImgBorder = css`
  border: 2px solid var(--overlay0);
`

const page__title = css`
  font-size: 2.3rem;
  font-weight: bold;
`

const page__headerShadow = css`
  width: 100%;
  height: 24rem;
  background: linear-gradient(to top, var(--crust) 0%, transparent 100%);
  position: absolute;
  bottom: 0;
  padding-inline: 20px;
  padding-top: 5px;
`

const page__titleWrap = css`
  position: absolute;
  bottom: 0;
  left: 0;
  padding-inline: 4rem;
  padding-bottom: 30px;
`

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
    <div id="root" class={`${page__root} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
      <header class={page__header}>
        {props.coverImage && <ImageOneItemView class={page__headerImgBorder} images={[props.coverImage]} />}
        <div class={page__headerShadow} />
        <div class={page__titleWrap}>
          <span class={page__title}>{props.title}</span>
          <MarkdownText>
            {props.description}
          </MarkdownText>
        </div>
      </header>
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