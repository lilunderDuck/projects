import { css, Show } from "../../core"

const section__root = css`
  margin-bottom: 20px;
  & > p:not(:last-child) {
    margin-bottom: 20px;
  }
`

const section__headerWrap = css`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
`

const section__header = css`
  padding-inline: 10px;
  padding-block: 5px;
  background-color: var(--sky);
  border-radius: 6px;
  color: var(--surface0);
  width: fit-content;
  flex-shrink: 0;
  font-size: 2rem;
  font-weight: bold;
`

const section__headerDivider = css`
  width: 100%;
  height: 5px;
  border-radius: 6px;
  background-color: var(--surface0);
`

export function ProjectSection(props: { children?: any, name?: string, class?: string }) {
  return (
    <section class={`${section__root} ${props.class ?? ""}`}>
      <Show when={props.name}>
        <div class={section__headerWrap}>
          <span class={section__header}>
            {props.name}
          </span>
          <div class={section__headerDivider} />
        </div>
      </Show>
      {props.children}
    </section>
  )
}