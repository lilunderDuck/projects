import { css, scrollbar, scrollbar__invs, scrollbar__vertical } from "../../core"
import { HomeHeader } from "../components"

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

export default function HomePage(props: { buildDate: string }) {
  return (
    <div id="root" class={`${page__root} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
      <HomeHeader buildDate={props.buildDate} />
      <main class={page__mainContent}>
        <ul class={page__projectList}>
          {/* {PROJECT_REGISTRY.map((it, index, _) => <ProjectItem {...it} index={index + 1} />)} */}
        </ul>
      </main>
    </div>
  )
}