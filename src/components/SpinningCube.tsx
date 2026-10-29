import { css } from "../core"

const cube__bound = css`
  --cube-size: 100px;
  --half-of-the-cube-size: calc(var(--cube-size) / 2);
  --reverse-half-of-the-cube-size: calc(-1 * var(--cube-size) / 2);
  --top-face-color: #ffc75e;
  --right-face-color: #eb4334;
  --bottom-face-color: #eb7134;
  --left-face-color: #34b4eb;
  --front-face-color: #ff78d0;
  --back-face-color: #ff5e81;
  width: var(--cube-size);
  height: var(--cube-size);
`

const cube = css`
  transform-style: preserve-3d;
  animation: cube__spinningAnimation 20s linear infinite;
  position: relative;
  top: 50%;
  left: 50%;
  margin-left: var(--reverse-half-of-the-cube-size);
  margin-top: var(--reverse-half-of-the-cube-size);
`

const cube__face = css`
  position: absolute;
`

const cube__top = css`
  transform: rotateX(90deg);
  margin-top: var(--reverse-half-of-the-cube-size);
  background-color: var(--top-face-color);
`

const cube__right = css`
  transform: rotateY(90deg);
  margin-left: var(--half-of-the-cube-size);
  background-color: var(--right-face-color);
`

const cube__bottom = css`
  transform: rotateX(-90deg);
  margin-top: var(--half-of-the-cube-size);
  background-color: var(--bottom-face-color);
`

const cube__left = css`
  transform: rotateY(-90deg);
  margin-left: var(--reverse-half-of-the-cube-size);
  background-color: var(--left-face-color);
`

const cube__front = css`
  transform: translateZ(var(--half-of-the-cube-size));
  background-color: var(--front-face-color);
`

const cube__back = css`
  transform: translateZ(var(--reverse-half-of-the-cube-size));
  background-color: var(--back-face-color);
`

interface ISpinningCubeProps {
  /**The size of this cube in pixels. Default to `100px` */
  cubeSize$?: number
}

export function SpinningCube(props: ISpinningCubeProps) {
  return (
    <div 
      class={`${cube__bound} cube__thisCube`}
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