import { For, scrollbar, scrollbar__invs, scrollbar__vertical, SpinningCube } from "../components"
import { HomeHeader, ProjectItem } from "../components"
import { css } from "../core"
import type { IProjectStat } from "../data"
import { GLOBAL_PROJECT_PAGE_INLINE_PADDING } from "../main"

const page__root = css`
  user-select: none;
  overflow-y: auto;
`

const page__mainContent = css`
  width: 100%;
  padding-top: 20px;
`

const page__projectList = css`
  padding-left: 0;
`

const page__spinningCube = css`
  width: 100%;
  height: 50%;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const page__pala = css`
  width: 100%;
  height: 30%;
  position: relative;
  & > svg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
`

export const HOME_PAGE_CLASSES = `${page__root} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`

export default function HomePage(props: { buildDate: string, projectList: IProjectStat[] }) {
  return (
    <>
      <HomeHeader buildDate={props.buildDate} />
      <main class={`${page__mainContent} ${GLOBAL_PROJECT_PAGE_INLINE_PADDING}`}>
        <ul class={page__projectList}>
          <For each={props.projectList}>
            {(it, index) => <ProjectItem {...it} index={index + 1} />}
          </For>
        </ul>
      </main>
      <div class={page__spinningCube}>
        <SpinningCube />
      </div>
      <div class={page__pala} >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#181825" fill-opacity="1" d="M0,160L60,165.3C120,171,240,181,360,165.3C480,149,600,107,720,101.3C840,96,960,128,1080,138.7C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
    </>
  )
}