import { Fragment, type JSX, type ReactElement } from "react"
import { elm, type HTMLAttribute } from "./element"
import { panic } from "../../utils"

// Used dummy HTMLAttribute<"div"> because I'm lazy
export type AnyReactElement = ReactElement<
  HTMLAttribute<"div"> & { children: any[] }, 
  keyof HTMLElementTagNameMap
>

export function recursivelyRenderJSXFast(element: JSX.Element | JSX.Element[]): string {
  // check for 'null' or 'undefined' case
  if (element == null || element == undefined) return ''

  if (Array.isArray(element)) {
    let stringifiedElement = ""
    for (const someElement of element) {
      if (typeof someElement === "string") {
        stringifiedElement += someElement
        continue
      }
      
      if (isExactlyAReactElement(someElement)) { // sanity check
        stringifiedElement += recursivelyRenderJSXFast(someElement)
      }
    }

    return stringifiedElement
  }

  if (typeof element === "string" || typeof element === "number") {
    return element
  }
  
  // edge-case: using other component like <OtherComponent />
  if (typeof element?.type === "function") {
    return recursivelyRenderJSXFast(element.type(element.props))
  }

  // edge-case: dealing with fragments, these guys -> <></>
  if (isExactlyAReactElement(element) && Object.is(element.type, Fragment)) {
    return recursivelyRenderJSXFast(element.props.children)
  }

  if (isExactlyAReactElement(element)) {
    const isEmptyProps = Object.keys(element.props).length === 0
    return elm(element.type, isEmptyProps ? undefined : element.props, recursivelyRenderJSXFast(element.props.children))
  }

  throw panic(`unknown element type ${element}`)
}

export function isExactlyAReactElement(element: JSX.Element): element is AnyReactElement {
  if (typeof element !== "object") return false

  return 'type' in element && 
    'key' in element && 
    'ref' in element
}