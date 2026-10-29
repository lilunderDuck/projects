import { css, For, scrollbar, scrollbar__invs, scrollbar__vertical } from "../core"
import { HomeHeader, ProjectItem } from "../components"
import type { IProjectStat } from "../data"

const page__root = css`
  user-select: none;
  overflow-y: auto;
`

const page__mainContent = css`
  width: 100%;
  padding-inline: 2rem;
  padding-top: 5px;
  padding-bottom: 15rem;
`

const page__projectList = css`
  padding-left: 0;
`

export default function HomePage(props: { buildDate: string, projectList: IProjectStat[] }) {
  return (
    <div id="root" class={`${page__root} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
      <HomeHeader buildDate={props.buildDate} />
      <main class={page__mainContent}>
        <ul class={page__projectList}>
          <For each={props.projectList}>
            {(it, index) => <ProjectItem {...it} index={index + 1} />}
          </For>
        </ul>
      </main>
    </div>
  )
}