import { css } from "../../core";

export const page__rootStyle = css`
  user-select: none;
  overflow-y: auto;
  & p, & ul, & table {
    font-size: 1.5rem;
  }

  & h2 {
    font-size: 2.3rem;
  }

  & h1 {
    font-size: 2.375rem;
  }
`