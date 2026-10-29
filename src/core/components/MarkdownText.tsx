import html2react from "html-react-parser"
import Prism from "prismjs"
import loadAllLang from "prismjs/components/index"
import { css } from "../libs"
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import { isExactlyAReactElement, type AnyReactElement } from "../utils"

const codeBlock__root = css`
  background-color: var(--mantle);
  padding-inline: 10px;
  padding-block: 5px;
  border-radius: 6px;
  white-space: break-spaces;
  margin-bottom: 10px;
  counter-reset: codeBlock;
`

const codeBlock__codeLine = css`
  counter-increment: codeBlock;
  content: counter(codeBlock);
`

loadAllLang()

Prism.languages['gdscript'] = Prism.languages.extend('python', {
  keyword: /\b(?:var|const|func|void|static|extends|class|class_name|signal|enum|null|breakpoint|tool)\b/,
  // bool, int, float already exist in python
  builtin: /\b(?:Variant|String|Vector2|Vector2i|Vector3|Vector3i|Vector4|Vector4i|Rect2|Rect2i|AABB|Transform2D|Transform3D|Projection|Quaternion|Basis|Plane|Color|RID|NodePath|StringName|Callable|Signal|Array|Dictionary|PackedByteArray|PackedInt32Array|PackedInt64Array|PackedFloat32Array|PackedFloat64Array|PackedStringArray|PackedVector2Array|PackedVector3Array|PackedColorArray)\b/,
  // copied from python
  'function': {
		pattern: /((?:^|\s)(func)[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
		lookbehind: true
	},
})

export function MarkdownText(props: { children: string }) {
  return Bun.markdown.react(props.children, {
    a(props) {
      const urlEndsWithMarkdown = props.href.endsWith(".md")
      const modifiedUrl = urlEndsWithMarkdown ? props.href.replace(".md", ".html") : props.href
      return (
        <a 
          href={modifiedUrl} 
          target={urlEndsWithMarkdown ? "_self" : "_blank"}
        >
          {props.children}
        </a>
      )
    },
    // code block
    pre(props) {
      if (!props.language) return (
        <pre class={codeBlock__root}>{props.children}</pre>
      )

      const stringifiedChildren = props.children.join('')
      const HTML_CODE = Prism.highlight(
        stringifiedChildren, 
        // @ts-ignore
        Prism.languages[props.language!], 
        props.language!
      )

      console.log("DPL - state transition REACT_CODE_BLOCK_QUICK_HACK running")
      const codeLines = painfullySplitingNewlines(html2react(HTML_CODE))

      console.log(codeLines)

      return (
        <pre class={codeBlock__root}>
          {codeLines}
        </pre>
      )
    }
  })
}

const SPLIT_NEWLINES_AND_KEEP_THAT = /(\n)/

// We want to add lines counter, but everything is statically rendered on build time,
// any prism plugins that touching the DOM api is not gonna work,
// this might be the worst hack I've wrote.
function painfullySplitingNewlines(codeLines: React.ReactNode | React.ReactNode[]) {
  if (!Array.isArray(codeLines)) {
    throw new Error(`expected an array or React.ReactNode, received ${typeof codeLines}, is there a mistake?`)
  }

  const splittedNewLines = codeLines.flatMap(that => {
    if (typeof that === "string" && that.includes("\n")) {
      return that.split(SPLIT_NEWLINES_AND_KEEP_THAT)
    }

    return that
  }).flat()

  const lineList: React.ReactNode[][] = []
  let currentLine: React.ReactNode[] = []
  for (const someCodePart of splittedNewLines) {
    if (someCodePart === "\n") {
      currentLine.push('\n')
      lineList.push(currentLine)
      currentLine = []
      continue
    }

    if (typeof someCodePart === "string") {
      currentLine.push(<span className="token plain-text">{someCodePart}</span>)
      continue
    }

    currentLine.push(someCodePart)
  }

  for (let i = 0; i < lineList.length; i++) {
    const thisReactNode = lineList[i]
    if (!thisReactNode || typeof thisReactNode !== "object") continue
    // @ts-ignore
    if (isExactlyAReactElement(thisReactNode)) {
      // please work, or else I'm gonna patch the react library inside node_modules itself.
      // oh hey look at that, [minecraft mod] mixins at plain sight!
      let firstNode = reactNodeUnfreezeReadonly(thisReactNode)
      // if (firstNode.props?.className) {
      //   firstNode.props['className'] = ''
      // }
      const classNames = (firstNode.props?.className ?? "").split(' ')
      classNames.push(codeBlock__codeLine)
      // @ts-ignore - satifies my own isExactlyAReactElement() check
      firstNode['ref'] = null
      firstNode.props.className = classNames.join(' ')
      lineList[i]![0] = firstNode
    }
  }

  assertMakeSureFirstLineIsInjectedByMyCSS(lineList)

  return lineList.flat()
}

function assertMakeSureFirstLineIsInjectedByMyCSS(output: React.ReactNode[][]) {
  for (let i = 0; i < output.length; i++) {
    const line = output[i]
    if (!line) throw new Error("Array index out of bound")
    if (typeof line[0] === "string") continue
    const isHasAny = 
      (line[0] as AnyReactElement).props.className?.includes(codeBlock__codeLine) ||
      (line[0] as AnyReactElement).props.class?.includes(codeBlock__codeLine)
    if (!isHasAny) {
      console.log("ERROR DURING PROJECT LOADING")
      console.log("Test failed, node detected is:", line[0], "css class it needs to have is:", codeBlock__codeLine)
      throw new Error("Missing CSS class at line index: " + i)
    }
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