import { css } from "../core"

const CUBE_SIZE = 100 //px
const CUBE_HALF_CUBE_SIZE = CUBE_SIZE / 2 //px
const CUBE_REVERSE_HALF_CUBE_SIZE = -1 * (CUBE_SIZE / 2) //px
const CUBE_TOP_FACE_COLOR = "#ffc75e"
const CUBE_RIGHT_FACE_COLOR = "#eb4334"
const CUBE_BOTTOM_FACE_COLOR = "#eb7134"
const CUBE_LEFT_FACE_COLOR = "#34b4eb"
const CUBE_FRONT_FACE_COLOR = "#ff78d0"
const CUBE_BACK_FACE_COLOR = "#ff5e81"

const cube__bound = css`
  width: ${CUBE_SIZE}px;
  height: ${CUBE_SIZE}px;
`

const cube = css`
  transform-style: preserve-3d;
  animation: cube__spinningAnimation 20s linear infinite;
  position: relative;
  top: 50%;
  left: 50%;
  margin-left: ${CUBE_REVERSE_HALF_CUBE_SIZE}px;
  margin-top: ${CUBE_REVERSE_HALF_CUBE_SIZE}px;
`

const cube__face = css`
  position: absolute;
`

const cube__top = css`
  transform: rotateX(90deg);
  margin-top: ${CUBE_REVERSE_HALF_CUBE_SIZE}px;
  background-color: ${CUBE_TOP_FACE_COLOR};
`

const cube__right = css`
  transform: rotateY(90deg);
  margin-left: ${CUBE_HALF_CUBE_SIZE}px;
  background-color: ${CUBE_RIGHT_FACE_COLOR};
`

const cube__bottom = css`
  transform: rotateX(-90deg);
  margin-top: ${CUBE_HALF_CUBE_SIZE}px;
  background-color: ${CUBE_BOTTOM_FACE_COLOR};
`

const cube__left = css`
  transform: rotateY(-90deg);
  margin-left: ${CUBE_REVERSE_HALF_CUBE_SIZE}px;
  background-color: ${CUBE_LEFT_FACE_COLOR};
`

const cube__front = css`
  transform: translateZ(${CUBE_HALF_CUBE_SIZE}px);
  background-color: ${CUBE_FRONT_FACE_COLOR};
`

const cube__back = css`
  transform: translateZ(${CUBE_REVERSE_HALF_CUBE_SIZE}px);
  background-color: ${CUBE_BACK_FACE_COLOR};
`

export function SpinningCube() {
  return (
    <div 
      class={cube__bound}
    >
      <div class={`${cube} ${cube__bound}`}>
        <div class={`${cube__face} ${cube__bound} ${cube__top}`} />
        <div class={`${cube__face} ${cube__bound} ${cube__right}`} />
        <div class={`${cube__face} ${cube__bound} ${cube__bottom}`} />
        <div class={`${cube__face} ${cube__bound} ${cube__left}`} />
        <div class={`${cube__face} ${cube__bound} ${cube__front}`} />
        <div class={`${cube__face} ${cube__bound} ${cube__back}`} />
      </div>
    </div>
  )
}