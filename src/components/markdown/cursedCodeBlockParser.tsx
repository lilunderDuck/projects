import { css, type AnyReactElement } from "../../core"
import { panic } from "../../utils"

const codeBlock__codeLine = css`
  &::before {
    counter-increment: codeBlock;
    content: counter(codeBlock);
    display: inline-block;
    width: 3.5rem;
    padding-inline: 15px;
    margin-right: 20px;
    text-align: right;
    background-color: var(--base);
    color: var(--overlay1);
  }

  &:first-child::before {
    padding-top: 10px;
  }
  
  &:nth-last-child(1)::before {
    padding-top: 10px;
  }
`

const codeBlock__firstLineExtraPadding = css`
  &::before {
    padding-top: 10px;
  }
`

const codeBlock__lastLineExtraPadding = css`
  &::before {
    padding-bottom: 10px;
  }
`

const SPLIT_NEWLINES_AND_KEEP_THAT = /(\n)/

// We want to add lines counter, but everything is statically rendered on build time,
// any prism plugins that touching the DOM api is not gonna work,
// this might be the worst hack I've wrote.
export function cursedCodeBlockParserWithLineNumbers(codeLines: React.ReactNode | React.ReactNode[]) {
  if (!Array.isArray(codeLines)) {
    throw panic(`expected an array or React.ReactNode, received ${typeof codeLines}, is there a mistake?`)
  }

  const splittedNewLines = codeLines.flatMap(that => {
    if (typeof that === "string") {
      // Fix: the below code will attempt to split "\n" -> ["", "\n", ""]
      // which we don't want it to do that
      if (that === "\n") return that
      if (that.includes("\n")) return that.split(SPLIT_NEWLINES_AND_KEEP_THAT) // <- "below code"
    }

    return that
  }).flat().filter(it => it !== "")

  const everything: React.ReactNode[] = []
  let shouldAppendCssClass = true // set to true because we want to count the first line as well
  let lastLineIndex = 0
  for (let i = 0; i < splittedNewLines.length; i++) {
    let someCodePart = splittedNewLines[i]

    if (someCodePart === "\n") {
      shouldAppendCssClass = true
      // push new line to make sure it doesn't do weird stuff with the UI
      everything.push("\n")
      continue // exit early to give the next element my CSS class
    }

    if (typeof someCodePart === "string") {
      someCodePart = <span className="token plain-text">{someCodePart}</span>
    }

    if (shouldAppendCssClass) {
      shouldAppendCssClass = false
      someCodePart = unreadonlyNodeAndAppendClassName(someCodePart as AnyReactElement, codeBlock__codeLine)
      lastLineIndex = i
      // make sure unfreezing doesn't do weird shit.
      assertMakeSureFirstNodeIsInjectedByMyCSS(someCodePart)
    }

    everything.push(someCodePart)
  }

  // can't figure out how to style the last line of code,
  // gonna throw this thing inside here
  everything[0] = unreadonlyNodeAndAppendClassName(everything[0] as AnyReactElement, codeBlock__firstLineExtraPadding)
  everything[lastLineIndex] = unreadonlyNodeAndAppendClassName(everything[lastLineIndex] as AnyReactElement, codeBlock__lastLineExtraPadding)

  return everything
}

function unreadonlyNodeAndAppendClassName(node: AnyReactElement, ...someClasses: string[]) {
  let unfreezedData = reactNodeUnfreezeReadonly(node as AnyReactElement)
  const classNames = (unfreezedData.props?.className ?? "").split(' ')
  classNames.push(...someClasses)
  // @ts-ignore - satifies my own isExactlyAReactElement() check
  unfreezedData['ref'] = "the_duck"
  unfreezedData.props.className = classNames.join(' ')

  return unfreezedData
}

function assertMakeSureFirstNodeIsInjectedByMyCSS(output: React.ReactNode) {
  const isHasAny = 
    (output as AnyReactElement).props.className?.includes(codeBlock__codeLine) ||
    (output as AnyReactElement).props.class?.includes(codeBlock__codeLine)
  if (!isHasAny) {
    console.log("Test failed, node detected is:", output, ", css class it needs to have is:", codeBlock__codeLine)
    throw panic("Missing CSS class at the first element")
  }
}

// Might be the most evil function I've wrote so far
function reactNodeUnfreezeReadonly<T extends Record<string | number, any>>(obj: T, visited = new WeakMap()): T {
  // options tried:
  //   { ...obj }                                 - object is not extensible.
  //   Object.assign({}, obj)                     - object is not extensible.
  //   structuredClone({}, obj)                   - The object can not be cloned.
  //   delete obj[key]                            - Unable to delete property.
  //   manual copy with cicular reference handled - seems to work
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (visited.has(obj)) {
    return visited.get(obj)
  }

  const clone = Array.isArray(obj) ? [] : {}
  visited.set(obj, clone)

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // @ts-ignore - Extract<keyof T, string> CAN index {} (empty object)
      clone[key] = reactNodeUnfreezeReadonly(obj[key], visited)
    }
  }

  return clone as T
}