import { MarkdownText, Tag } from "../components"
import { css } from "../core"
import { PROJECT_STATUS_REGISTRY, PROJECT_TYPE_COLOR_MAPPING, type IProjectStat } from "../data"

const item__root = css`
  list-style: none;
  padding-inline: 10px;
  padding-block: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  border-radius: 6px;
  &:hover {
    background-color: var(--surface0);
  }

  & p {
    font-size: 1.06rem;
  }
`

const item__indexWrap = css`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-shrink: 0;
  margin-top: 5px;
`

const item__indexNumber = css`
  font-size: 2rem;
  width: 30px;
  flex-shrink: 0;
  text-align: center;
`

const item__icon = css`
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 6px;
`

const item__titleWrap = css`
  margin-bottom: 5px;
`

const item__tagList = css`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 15px;
  flex-wrap: wrap;
`

export function ProjectItem(props: IProjectStat & { index: number }) {
  return (
    <li class={item__root}>
      <div class={item__indexWrap}>
        <div class={item__indexNumber}>
          {props.index}
        </div>
        <img class={item__icon} draggable={false} src={`./${props.id}/assets/${props.icon}`} alt="">
          {/* ... */}
        </img>
      </div>
      <div>
        <h2 class={item__titleWrap}>
          <a href={`./${props.id}/index.html`}>
            {props.title}
          </a>
        </h2>
        <MarkdownText>
          {props.description}
        </MarkdownText>
        <div class={item__tagList}>
          <Tag bgColor={PROJECT_TYPE_COLOR_MAPPING.getOrElseThrow(props.type)}>
            {props.type}
          </Tag>
          <Tag bgColor={PROJECT_STATUS_REGISTRY.getOrElseThrow(props.status).color}>
            {props.status}
          </Tag>
          {props.id.includes("toast") && (
            <Tag bgColor={'var(--yellow)'}>
              Baguette ecosystem
            </Tag>
          )}
        </div>
      </div>
    </li>
  )
}