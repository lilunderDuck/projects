import { compile, serialize, stringify, type Element as CSSElement } from "stylis"
import { createSingleWordSlidingRandomizer } from "../dumb_random"
import { panic } from "../../../utils"

const cachedCssValues = new Map<string, string>()
export function dumpCSS() {
  let everything = ""
  for (const cssRule of cachedCssValues.values()) {
    everything += cssRule
  }

  return everything
}

const CSS_DEFAULT_HANDLER = cssAtomicHandler()

/**Dummy-ish css templated function to make use of `styled-component` highlighting.
 * 
 * To create style, all you need to do is:
 * ```tsx
 * const app__page = css`
 *   padding-inline: 10px;
 *   padding-block: 15px;
 *   &:hover {
 *     background-color: black;
 *   }
 * `
 * 
 * // use it somewhere, example:
 * <div class={app__page} />
 * ```
 * 
 * @param template the templated string array, just ignore it and follow the example above.
 * @returns the compiled CSS classnames
 * @see `dumb_random.ts` for example randomizer function
 * @see {@link cssAtomicHandler()}
 */
export function css(template: TemplateStringsArray): string {
  const rawCss = template.join(' ')
  return CSS_DEFAULT_HANDLER(rawCss)
}

/**An (almost) accurate atomic CSS-in-js handler. "Atomic" just means it will generate a class name
 * for every style `property: value` pair, [`tailwind css`](https://tailwindcss.com/) but fancier.
 * 
 * What does it do is... basically, if I have some style:
 * ```
 * const someStyl = css`
 *   padding-inline: 10px;
 *   &:hover {
 *     background-color: red;
 *     color: black;
 *   }
 * `
 * ```
 * 
 * It will generate something lile this one:
 * ```
 * // generated CSS name
 * const someStyl = "d6zW1 f3BS3 z8TKe"
 * ```
 * ```css
 * .d6zW1 { padding-inline: 10px }
 * .f3BS3:hover { background-color: red }
 * .z8TKe:hover { color: black }
 * ```
 * 
 * Except, for this one, it doesn't handle style duplication, **nested style is not breaking down**,
 * and the name is not a cat running through a keyboard.
 * 
 * Which also mean:
 * ```
 * const style_1 = css`
 *   padding-inline: 10px;
 *   &:hover {
 *     background-color: red;
 *     color: black;
 *   }
 * `
 * 
 * const style_2 = css`
 *   padding-inline: 10px;
 * `
 * ```
 * 
 * ...will generate this:
 * ```
 * // generated CSS name, the name is from my source set
 * const style_1 = "the missle"
 * const style_2 = "knows"
 * ```
 * 
 * ```css
 * .the { padding-inline: 10px; }
 * .missle:hover { background-color: red; color: black }
 * .knows { padding-inline: 10px; } // duplicated padding-inline property here
 * ```
 * 
 * @param nameRandomizer a randomizer function to generate CSS class name, 
 * default is `createSingleWordSlidingRandomizer()`
 * 
 * @see {@link createSingleWordSlidingRandomizer()}
 * @see {@link simpleCSSBlocksParser()}
 * @returns 
 */
function cssAtomicHandler(nameRandomizer = createSingleWordSlidingRandomizer()) {
  const MAX_WORD_LENGTH = 1

  return (rawCss: string) => {
    const { rootDeclarations, nestedBlocks } = simpleCSSBlocksParser(rawCss)
    const compiledClassnames: string[] = []

    for (const [prop, val] of Object.entries(rootDeclarations)) {
      // const cacheKey = `${prop}:${val}`
      const thisClassname = nameRandomizer(MAX_WORD_LENGTH)
      const rule = `.${thisClassname} { ${prop}: ${val}; }` as const
      const compiled = serialize(compile(rule), stringify)
      
      cachedCssValues.set(compiled, compiled)
      compiledClassnames.push(thisClassname)
    }

    if (nestedBlocks.length > 0) {
      const baseClass = nameRandomizer(MAX_WORD_LENGTH)
      
      for (const block of nestedBlocks) {
        const nestedRule = `.${baseClass} { ${block.selector} { ${block.body} } }` as const
        const compiled = serialize(compile(nestedRule), stringify)
        
        cachedCssValues.set(compiled, compiled)
      }
      compiledClassnames.push(baseClass)
    }
    
    return compiledClassnames.join(' ')
  }
}

interface IFastCSSParserRef { 
  nestedBlocks: { selector: string; body: string }[]
}

function simpleCSSBlocksParser(cssString: string) {
  // Functions are passed by reference, so we can pass in a object
  // to mutate (I called) "ref" object
  const ref: IFastCSSParserRef = {
    nestedBlocks: []
  }

  const rootText = recursivelyParseCSSFast(compile(cssString), ref)
  
  // Parse remaining root declarations separated by semicolons
  const rootDeclarations: Record<string, string> = {}
  rootText.split(';').forEach(rule => {
    const [prop, val] = rule.split(':').map(s => s.trim())
    if (prop && val) {
      rootDeclarations[prop] = val
    }
  })

  return { rootDeclarations, nestedBlocks: ref.nestedBlocks }
}

function recursivelyParseCSSFast(thisCssRule: CSSElement[], ref: IFastCSSParserRef) {
  let rootText = ""
  for (const cssRule of thisCssRule) {
    // cssRule.type have the type of: string
    // would be the best if they declare a type for their css type...
    switch (cssRule.type) {
      case "decl":
        rootText += cssRule.value
      continue

      case "rule":
        if (!Array.isArray(cssRule.children)) {
          throw panic(`panic: wrong type passed in`)
        }

        ref.nestedBlocks.push({
          body: recursivelyParseCSSFast(cssRule.children, ref),
          // Don't know why my selector names include \F character,
          // so we gonna make sure it doesn't do weird shit with our output
          selector: cssRule.value.replaceAll("\f", "")
        })

      continue

      case "comm": // comment
        // ... skip ...
      continue
    
      default: throw panic("unknown CSS type: " + cssRule.type)
    }
  }

  return rootText
}