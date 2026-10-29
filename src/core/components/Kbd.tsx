import { css } from "../libs"

const kbd = css`
  border-style: solid;
  border-radius: 0.375rem;
  border-color: var(--overlay0);
  border-width: 1px 1px 3px;
  background-color: #131212;
  color: var(--text);
  padding-inline: 0.4em;
  font-family: consolas;
  font-weight: bold;
  white-space: nowrap;
`

export function Kbd(props: { children?: any }) {
  return (
    <kbd class={kbd}>
      {props.children}
    </kbd>
  )
}