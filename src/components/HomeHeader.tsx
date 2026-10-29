import { css } from "../core"

const page__header = css`
  width: 100%;
  height: 18rem;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  & > svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 115%;
    z-index: -1;
  }
`

// const page__pala = css`
//   background-size: 140%;
// `

const page__title = css`
  text-align: center;
  font-size: 3.5rem;
`

const page__description = css`
  text-align: center;
  font-size: 1.06rem;
`

const page__updateNote = css`
  color: var(--subtext0);
`

export function HomeHeader(props: { buildDate: string }) {
  return (
    <header class={page__header}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#181825" fill-opacity="1" d="M0,256L60,250.7C120,245,240,235,360,240C480,245,600,267,720,266.7C840,267,960,245,1080,240C1200,235,1320,245,1380,250.7L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
      </svg>
      <div>
        <h1 class={page__title}>The duck's project index</h1>
        <p class={page__description}>
          Some projects <a href="https://github.com/lilunderDuck" target="_blank">
            mint_duck
          </a> are currently doing <span class={page__updateNote}>
            (As for {props.buildDate})
          </span>.
        </p>
      </div>
    </header>
  )
}