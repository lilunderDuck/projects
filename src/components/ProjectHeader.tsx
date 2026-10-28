import { css, MarkdownText, Show } from "../../core"
import type { IProjectStat } from "../data"
import { ImageOneItemView } from "./ImageItemsView"

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

const header__bannerImage = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export function ProjectHeader(props: IProjectStat) {
  return (
    <header class={header__root}>
      <Show when={props.banner} fallback={
        <div class={`${header__bannerImage} ${header__headerImgBorder}`} />
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