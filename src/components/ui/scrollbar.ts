import { css } from "../../core"

const SCROLLBAR_TRACK_COLOR = 'var(--base)'
const SCROLLBAR_THUMB_COLOR = 'var(--surface0)'
const SCROLLBAR_BORDER_RADIUS = 3 //px
const SCROLLBAR_THUMB_PAD = 1 //px
const SCROLLBAR_SIZE = 12 //px

export const scrollbar = css`
  will-change: transform;
  &::-webkit-scrollbar {
    width: ${SCROLLBAR_SIZE}px;
    height: ${SCROLLBAR_SIZE}px;
  }

  &::-webkit-scrollbar-track {
    background: ${SCROLLBAR_TRACK_COLOR};
    border-radius: ${SCROLLBAR_BORDER_RADIUS}px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${SCROLLBAR_THUMB_COLOR};
    border-radius: ${SCROLLBAR_BORDER_RADIUS}px;
    border: ${SCROLLBAR_THUMB_PAD}px solid ${SCROLLBAR_TRACK_COLOR};
  }
`

export const scrollbar__vertical = css`
  overflow-y: auto;
`

export const scrollbar__horizontal = css`
  overflow-x: auto;
`

export const scrollbar__invs = css`
  &::-webkit-scrollbar {
    display: none;
  }
`