import { MarkdownText, Tag } from "../components"
import { css } from "../core"
import { PROJECT_STATUS_REGISTRY, PROJECT_TYPE_COLOR_MAPPING, type IProjectStat } from "../data"

const item__root = css`
  list-style: none;
  padding-inline: 10px;
  padding-block: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-radius: 6px;
  &:hover {
    background-color: var(--surface0);
  }
`

const item__index = css`
  font-size: 2rem;
  width: 30px;
  flex-shrink: 0;
`

const item__icon = css`
  width: 4.25rem;
  height: 4.25rem;
  flex-shrink: 0;
  border-radius: 6px;
  border: 4px solid var(--surface2);
`

const item__titleWrap = css`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
`

export function ProjectItem(props: IProjectStat & { index: number }) {
  return (
    <li class={item__root}>
      <div class={item__index}>
        {props.index}
      </div>
      <img class={item__icon} draggable={false} src={`./${props.id}/assets/${props.icon}`} alt="">
        {/* ... */}
      </img>
      <div>
        <div class={item__titleWrap}>
          <h2>
            <a href={`./${props.id}/index.html`}>
              {props.title}
            </a>
          </h2>
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
        <MarkdownText>
          {props.description}
        </MarkdownText>
      </div>
    </li>
  )
}