import { css } from "../../core"

const page__header = css`
  width: 100%;
  height: 18rem;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--mantle);
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  margin-bottom: 10px;
`

const page__title = css`
  text-align: center;
  font-size: 3.5rem;
`

const page__description = css`
  text-align: center;
`

const page__updateNote = css`
  color: var(--subtext0);
`

export function HomeHeader(props: { buildDate: string }) {
  return (
    <header class={page__header}>
      <div>
        <h1 class={page__title}>The duck's project index</h1>
        <p class={page__description}>
          Some project <a href="https://github.com/lilunderDuck" target="_blank">
            mint_duck
          </a> is currently doing <span class={page__updateNote}>
            (As for {props.buildDate})
          </span>.
        </p>
      </div>
    </header>
  )
}