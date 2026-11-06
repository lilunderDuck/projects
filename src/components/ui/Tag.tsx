import { createCSSVar, css } from "../../core"

const TAG_BACKGROUND_COLOR_VAR = createCSSVar()

const tag__root = css`
  user-select: none;
  padding-inline: 10px;
  padding-block: 2px;
  border-radius: 6px;
  background-color: var(${TAG_BACKGROUND_COLOR_VAR});
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
    <div class={tag__root} style={`${TAG_BACKGROUND_COLOR_VAR}:${props.bgColor}`}>
      {props.children}
    </div>
  )
}