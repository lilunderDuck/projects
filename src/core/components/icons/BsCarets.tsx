// icon code is adapted from: https://solid-icons.vercel.app/search/package/bs/caret
// Bootstrap Icons is licenced under MIT
export function BsCaretDownFill(props: { size?: string }) {
  return (
    // @ts-ignore
    <svg fill="currentColor" viewBox="0 0 16 16" color="currentColor" height={props.size ?? "1em"} width={props.size ?? "1em"} xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"></path>
    </svg>
  )
}

export function BsCaretLeftFill(props: { size?: string }) {
  return (
    // @ts-ignore
    <svg fill="currentColor" viewBox="0 0 16 16" color="currentColor" height={props.size ?? "1em"} width={props.size ?? "1em"} xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
      <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"></path>
    </svg>
  )
}

export function BsCaretRightFill(props: { size?: string }) {
  return (
    // @ts-ignore
    <svg fill="currentColor" viewBox="0 0 16 16" color="currentColor" height={props.size ?? "1em"} width={props.size ?? "1em"} xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
      <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"></path>
    </svg>
  )
}
