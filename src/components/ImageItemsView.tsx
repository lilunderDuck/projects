import { css } from "../../core"

const view__oneItemView = css`
  width: 100%;
  height: 100%;
`

export function ImageOneItemView(props: ImageViewPropsCompatible) {
  return (
    <div class={`${view__oneItemView} ${props.class ?? ""}`}>
      <img class={view__image} src={`./assets/${props.images[0]}`} draggable={false} />
    </div>
  )
}

const view__boundingFix = css`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
`

const view__root = css`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
`

const view__item1 = css`
  grid-column: span 3 / span 3;
  grid-row: span 5 / span 5;
`

const view__item2 = css`
  grid-column: span 2 / span 2;
  grid-row: span 3 / span 3;
  grid-column-start: 4;
`

const view__item3 = css`
  grid-column: span 2 / span 2;
  grid-row: span 2 / span 2;
  grid-column-start: 4;
  grid-row-start: 4;
`

const view__image = css`
  object-fit: cover;
  width: 100%;
`

type ImageViewPropsCompatible = { images: string[], class?: string }

export function ImageThreeItemView(props: ImageViewPropsCompatible) {
  return (
    <div class={`${view__root} ${view__boundingFix}`}>
      <div class={view__item1}>
        <img class={view__image} src={`./assets/${props.images[0]}`} draggable={false} />
      </div>
      <div class={view__item2}>
        <img class={view__image} src={`./assets/${props.images[1]}`} draggable={false} />
      </div>
      <div class={view__item3}>
        <img class={view__image} src={`./assets/${props.images[2]}`} draggable={false} />
      </div>
    </div>
  )
}

const item__fiveItem = css`
  grid-row: span 5 / span 5;
`

export function ImageFiveItemView(props: ImageViewPropsCompatible) {
  const items = [props.images[0], props.images[1], props.images[2], props.images[3], props.images[4]]

  return (
    <div class={`${view__root} ${view__boundingFix}`}>
      {items.map(it => (
        <div class={item__fiveItem}>
          <img class={view__image} src={`./assets/${it}`} draggable={false} />
        </div>
      ))}
    </div>
  )
}

export function ImageItemView(props: { coverImage: string[] }) {
  if (!props.coverImage) return <></>

  switch (props.coverImage.length) {
    case 1: return <ImageOneItemView images={props.coverImage} />
    case 3: return <ImageThreeItemView images={props.coverImage} />
    case 5: return <ImageFiveItemView images={props.coverImage} />
  
    default: return <></>
  }
}