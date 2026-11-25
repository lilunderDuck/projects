import { MarkdownText, Show, Tag } from "."
import { css } from "../core"
import { PROJECT_STATUS_REGISTRY, PROJECT_TYPE_COLOR_MAPPING, type AnyProject, type IProjectStat, type ProjectMetadataSchema } from "../api"

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
  object-fit: cover;
`

const item__titleWrap = css`
  margin-bottom: 5px;
`

const item__nameWrap = css`
  display: flex;
  gap: 10px;
  align-items: center;
`

export function ProjectGroupItem(props: ProjectMetadataSchema & { index: number }) {
  return (
    <li class={item__root}>
      <div class={item__indexWrap}>
        <div class={item__indexNumber}>
          {props.index}
        </div>
        <img loading="lazy" height={68} class={item__icon} draggable={false} src={`./${props.id}/assets/${props.icon}`} alt="">
          {/* ... */}
        </img>
      </div>
      <div>
        <div class={item__nameWrap}>
          <h2 class={item__titleWrap}>
            <a href={`./${props.id}/index.html`}>
              {props.title}
            </a>
          </h2>
          <Tag bgColor="var(--lavender)">
            group
          </Tag>
        </div>
        <MarkdownText>
          {props.description}
        </MarkdownText>
      </div>
    </li>
  )
}