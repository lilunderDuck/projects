import { css } from "../core"
import { BsCaretLeftFill } from "./icons"

const button__root = css`
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 2rem;
  margin-top: 20px;
  z-index: 10;
`

const button__backButton = css`
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: var(--mantle);
  font-size: 1.5rem;
  padding-inline: 10px;
  padding-block: 5px;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`

interface IBackToHomeButtonProps {
  href?: string
  label?: string
}

export function BackToHomeButton(props: IBackToHomeButtonProps) {
  return (
    <div class={button__root}>
      <a data-link-no-color class={button__backButton} href={props.href ?? "../index.html"}>
        <BsCaretLeftFill size="2rem" />
        {props.label ?? "Back to home"}
      </a>
    </div>
  )
}