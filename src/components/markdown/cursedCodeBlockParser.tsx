import { css, elm } from "../../core"
import { panic } from "../../utils"
import hast from "hast"

const TOKEN_COLOR_REMAPPING = {
  /* keyword */ "#CA9EE6": css`color:#CA9EE6;`,
  /* comment */ "#949CBB": css`color:#949CBB;`,
  /* functions */ "#8CAAEE": css`color:#8CAAEE;`,
  /* literal */ "#E78284": css`color:#E78284;`,
  /* props access */ "#EA999C": css`color:#EA999C;`,
  /* operators */ "#81C8BE": css`color:#81C8BE;`,
  /* numbers */ "#EF9F76": css`color:#EF9F76;`,
  /* strings */ "#A6D189": css`color:#A6D189;`,
  /* class */ "#E5C890": css`color:#E5C890;`,
  /* unknown */ "#C6D0F5": css`color:#C6D0F5;`,
}

function grabIfHas<T extends Record<string, any>>(thisThing: string | undefined, inObject: T) {
  for (const key of Object.keys(inObject)) {
    if ((thisThing ?? "").includes(key)) {
      return inObject[key]
    }
  }

  throw panic("key not found, tried to search", thisThing, "inside", inObject)
}

const codeBlock__codeLine = css`
  position: relative;
  padding-left: 4.5rem;
  display: inline-block;
  &::before {
    counter-increment: codeBlock;
    content: counter(codeBlock);
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 3.5rem;
    height: 100%;
    padding-inline: 15px;
    text-align: right;
    background-color: var(--base);
    color: var(--overlay1);
  }

  &:first-child,
  &:first-child::before {
    padding-top: 10px;
  }

  &:last-child,
  &:last-child::before {
    padding-bottom: 10px;
  }
`

type AnyHastType = 
  hast.Root |
  hast.Element |
  hast.Comment |
  hast.Doctype |
  hast.Text |
  AnyHastType[]
// ...

export function cursedRecursiveCodeBlockRenderer(thisThing: AnyHastType): string {
  if (Array.isArray(thisThing)) {
    const everything = [] as string[]
    for (const node of thisThing) {
      everything.push(cursedRecursiveCodeBlockRenderer(node))
    }

    return everything.join('')
  }

  if (thisThing.type === "root") {
    return cursedRecursiveCodeBlockRenderer(thisThing.children)
  }

  if (thisThing.type === "element") {
    switch (thisThing.tagName) {
      case "pre":
      case "code":
        // skip, don't do anything, because the below function will absolutely mess
        // with react nodes to add line numbers
        return thisThing.children.map(it => cursedRecursiveCodeBlockRenderer(it)).join('')

      case "span":
        // prevent empty new line
        if (thisThing.children.length === 0) return ''

        if (thisThing.properties.class === "line") {
          return elm(
            "span",
            { class: codeBlock__codeLine },
            thisThing.children.map(it => cursedRecursiveCodeBlockRenderer(it)).join('')
          )
        }

        const className = grabIfHas(thisThing.properties.style, TOKEN_COLOR_REMAPPING)

        return elm(
          "span",
          { class: className },
          thisThing.children.map(it => cursedRecursiveCodeBlockRenderer(it)).join('')
        )
    
      default: throw panic(`case ${thisThing.type} for <${thisThing.tagName} /> is not being handled`)
    }
  }

  if (thisThing.type === "text") {
    return thisThing.value
  }
  
  throw panic(`case ${thisThing.type} is not being handled`)
}