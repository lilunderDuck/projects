import { css } from "../../core"

const tag__root = css`
  user-select: none;
  padding-inline: 10px;
  padding-block: 2px;
  border-radius: 6px;
  background-color: var(--tag-bg-color);
  color: var(--crust);
  width: fit-content;
`

interface ITagProps {
  bgColor: string
  children?: any
}

export function Tag(props: ITagProps) {
  return (
    // @ts-ignore
    <div class={tag__root} style={`--tag-bg-color:${props.bgColor}`}>
      {props.children}
    </div>
  )
}