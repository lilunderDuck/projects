import { BsCaretLeftFill, MarkdownText, Show } from "../components"
import { css } from "../core"
import type { IProjectStat } from "../data"

const header__root = css`
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

const header__headerImgBorder = css`
  border: 2px solid var(--overlay0);
`

const header__title = css`
  font-size: 2.3rem;
  font-weight: bold;
`

const header__headerShadow = css`
  width: 100%;
  height: 24rem;
  background: linear-gradient(to top, var(--crust) 0%, transparent 100%);
  position: absolute;
  bottom: 0;
  padding-inline: 20px;
  padding-top: 5px;
`

const header__titleWrap = css`
  position: absolute;
  bottom: 0;
  left: 0;
  padding-inline: 4rem;
  padding-bottom: 30px;
`

const header__missingBannerImage = css`
  background-size: 40px 40px;
  background-image: radial-gradient(var(--surface1) 2px, transparent 2px);
  width: 100%;
  height: 100%;
  background-color: var(--mantle);
  animation: dot_grid_move 5s linear infinite;
`

const header__bannerImage = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const header__backButton = css`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: var(--mantle);
  z-index: 10;
  font-size: 1.5rem;
  padding-inline: 10px;
  padding-block: 5px;
  margin-left: 2rem;
  margin-top: 20px;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`

export function ProjectHeader(props: IProjectStat) {
  return (
    <header class={header__root}>
      <a data-link-no-color class={header__backButton} href="../index.html">
        <BsCaretLeftFill size="2rem" />
        Back
      </a>
      <Show when={props.banner} fallback={
        <div class={`${header__bannerImage} ${header__headerImgBorder}`}>
          <div class={header__missingBannerImage} />
        </div>
      }>
        <img class={`${header__bannerImage} ${header__headerImgBorder}`} src={`./assets/${props.banner}`} draggable={false} />
      </Show>
      <div class={header__headerShadow} />
      <div class={header__titleWrap}>
        <span class={header__title}>{props.title}</span>
        <MarkdownText>
          {props.description}
        </MarkdownText>
      </div>
    </header>
  )
}