type ChildNodeCompatible = string | number | null | undefined | ChildNodeCompatible[]
export type HTMLAttribute<T extends keyof HTMLElementTagNameMap> = Partial<HTMLElementTagNameMap[T]> & {
  class?: string
  // workaround hack: add this catch-all index to make typescript happy
  [any: string]: string | undefined
}

export function elm<T extends keyof HTMLElementTagNameMap>(
  tag: T, 
  tagAttributes: HTMLAttribute<T> | undefined, 
  child: ChildNodeCompatible = []
) {
  let stringifiedAttribute = ""
  let childern = stringifyChildern(child)

  // don't count "children" attribute, otherwise the tag will have an extra space
  if (tagAttributes && 'children' in tagAttributes && Object.keys(tagAttributes).length == 1) {
    tagAttributes = undefined
  }
  
  for (let attributeName in tagAttributes) {
    let attributeValue = tagAttributes[attributeName]
    if (attributeName == "children") {
      continue // skip
    }

    if (attributeName === "defer") { // encounter "defer" attribute in <script> element
      attributeValue = "" // patch the value of "defer" from "true" to "" (nothing)
    }

    // edge-case: javascript land call "class"... "className"
    // so we need to handle that as well
    // oh god, the ReactJS flashback is getting me
    if (attributeName == "className") {
      // also to make typescript happy, as always
      attributeName = "class" as Extract<keyof HTMLElementTagNameMap[T], string>
    }
    stringifiedAttribute += `${attributeName}="${attributeValue}" `
  }

  // Fix w3c error: Stray end tag img.
  if (["img"].includes(tag)) {
    return `<${tag}${tagAttributes ? ` ${stringifiedAttribute.trim()}` : ""}>`
  }

  return `<${tag}${tagAttributes ? ` ${stringifiedAttribute.trim()}` : ""}>${childern}</${tag}>` as const
}

function stringifyChildern(child: ChildNodeCompatible) {
  let childern = ""
  if (!child) {
    // do nothing
  } else {
    childern = `${child}`
  }

  if (Array.isArray(child)) {
    childern = child.join('')
  }

  return childern
}