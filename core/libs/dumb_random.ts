/* ### Dumb randomizer by `lilunderduck`, licenced under MIT.
 * 
 * A randomizer, but not... random, predictable random*.
 * 
 * What does it do?
 * - Just a good old css class name obfuscation, instead of random combination of character 
 *   (which is boring), it generates (almost) a full sentence, also to confuse someone 
 *   who reading the source code.
 * 
 * What you shouldn't use
 * - Password hashing
 * - Password randomizer
 * - Basically anything related to password, and encryption, and banks, and anything that needs 
 *   true random, you should **use a bunch of lava lamps** as the source of true randomness 
 *   instead of this
 * - Does not count for production, it's just a "workaround"
 * 
 * Lovely!
 */
// ...

const splitAndClean = (something: string) => something
  .toLowerCase()
  .replaceAll("\n", "")
  // ultra specific case, do not touch
  .replaceAll(".", "_dot_")
  .replaceAll(/'|"|\?|-/gm, "")
  .replaceAll(/,|\:|\(|\)|\;|@/gm, "_")
  .split(" ")
// ...

/**The default source set for `createWordSlidingRandomizer()` function to generate some names.
 * 
 * The sources are adapted from: 
 * - [`The missle knows where it is at all times`](https://copypastatext.com/the-missile-knows-where-it-is/)
 * 
 * @see {@link createWordSlidingRandomizer()}
 * @see {@link createSingleWordSlidingRandomizer()}
 */
const SRC_MISSILE_DEFAULT = `
The missile knows where it is at all times. It knows this because it knows where it isn't. By subtracting where it is from where it isn't, or where it isn't from where it is (whichever is greater), it obtains a difference, or deviation. The guidance subsystem uses deviations to generate corrective commands to drive the missile from a position where it is to a position where it isn't, and arriving at a position where it wasn't, it now is. Consequently, the position where it is, is now the position that it wasn't, and it follows that the position that it was, is now the position that it isn't.

In the event that the position that it is in is not the position that it wasn't, the system has acquired a variation, the variation being the difference between where the missile is, and where it wasn't. If variation is considered to be a significant factor, it too may be corrected by the GEA. However, the missile must also know where it was.

The missile guidance computer scenario works as follows. Because a variation has modified some of the information the missile has obtained, it is not sure just where it is. However, it is sure where it isn't, within reason, and it knows where it was. It now subtracts where it should be from where it wasn't, or vice-versa, and by differentiating this from the algebraic sum of where it shouldn't be, and where it was, it is able to obtain the deviation and its variation, which is called error.
`

/**Adapted from: 
 * - [`Neoforge's Registries for 1.21.1`](https://docs.neoforged.net/docs/concepts/registries/)
 * - [`Neoforge's Events for 1.21.1`](https://docs.neoforged.net/docs/1.21.1/concepts/events/#event-buses)
 * 
 * @see {@link createWordSlidingRandomizer()}
 * @see {@link createSingleWordSlidingRandomizer()}
 */
export const SRC_NEOFORGE_DOCS_SET = `
Registration is the process of taking the objects of a mod (such as items, blocks, entities, etc.) and making them known to the game. Registering things is important, as without registration the game will simply not know about these objects, which will cause unexplainable behaviors and crashes.

A registry is, simply put, a wrapper around a map that maps registry names (read on) to registered objects, often called registry entries. Registry names must be unique within the same registry, but the same registry name may be present in multiple registries. The most common example for this are blocks (in the BLOCKS registry) that have an item form with the same registry name (in the ITEMS registry).

Every registered object has a unique name, called its registry name. The name is represented as an Identifier. For example, the registry name of the dirt block is minecraft:dirt, and the registry name of the zombie is minecraft:zombie. Modded objects will of course not use the minecraft namespace; their mod id will be used instead.

Registries generally register singletons. This means that all registry entries exist exactly once. For example, all stone blocks you see throughout the game are actually the same stone block, displayed many times. If you need the stone block, you can get it by referencing the registered block instance.

Custom registries allow you to specify additional systems that addon mods for your mod may want to plug into. For example, if your mod were to add spells, you could make the spells a registry and thus allow other mods to add spells to your mod, without you having to do anything else. It also allows you to do some things, such as syncing the entries, automatically.


While most events are posted on the NeoForge.EVENT_BUS, some events are posted on the mod event bus instead. These are generally called mod bus events. Mod bus events can be distinguished from regular events by their superinterface IModBusEvent.
`

/**Adapted from: 
 * - [`Cat - From Wikipedia, the free encyclopedia`](https://en.wikipedia.org/wiki/Cat)
 * - [`Psychology from Cats and the Internet`](https://en.wikipedia.org/wiki/Cats_and_the_Internet#Psychology)
 * 
 * @see {@link createWordSlidingRandomizer()}
 * @see {@link createSingleWordSlidingRandomizer()}
 */
export const SRC_CAT_SET = `
The cat (Felis catus), also called domestic cat and house cat, is a small domesticated carnivorous mammal. It is a member of Felidae, the family of mammals in the order Carnivora also colloquially referred to as cats. An obligate carnivore requiring a predominantly meat-based diet, it has retractable claws adapted to killing small prey species such as mice and rats. It has a strong, flexible body, quick reflexes, and sharp teeth, and its night vision and sense of smell are well developed. It is a social species, but a solitary hunter and a crepuscular predator. Cat communication includes meowing, purring, trilling, hissing, growling, grunting, body language, and scent marking. It can hear sounds too faint or too high in frequency for human ears, such as those made by small mammals. It secretes and perceives pheromones. Cat intelligence is evident in its ability to adapt, learn through observation, and solve problems. The domestic cat is the only domesticated species of the family Felidae.


Cats and the Internet as a subject has attracted the attention of various scholars and critics, who have analysed why this subject has reached iconic status. Although it may be considered frivolous, cat-related Internet content contributes to how people interact with media and culture. Some argue that there is a depth and complexity to this seemingly simple content, with a suggestion that the positive psychological effects that pets have on their owners also hold true for cat images viewed online. Research has suggested that viewing online cat media is related to positive emotions, and that it even may work as a form of digital therapy or stress relief for some users. Some elements of research also show that feelings of guilt when postponing tasks can be reduced by viewing cat content.

Jason Eppink, curator of the Museum of the Moving Image's show How Cats Took Over the Internet, has noted the "outsized role" of cats on the Internet. Wired magazine felt that the cuteness of cats was "too simplistic" an explanation of their popularity online.

A scientific survey found that the participants were happier after watching cat videos. The researcher behind the survey explained "If we want to better understand the effects the Internet may have on us as individuals and on society, then researchers can't ignore Internet cats anymore" and "consumption of online cat-related media deserves empirical attention". The Huffington Post suggested that the videos were a form of procrastination, with most being watched while at work or ostensibly studying, while IU Bloomington commented "[it] does more than simply entertain; it boosts viewers' energy and positive emotions and decreases negative feelings". Business Insider argues "This falls in line with a body of research regarding the effects that animals have on people." A 2015 study by Jessica Gall Myrick found that people were more than twice as likely to post a picture or video of a cat to the Internet than they were to post a selfie.
`

export type AnyRandomizerFn = /* roll */(length: number) => string

/**A factory function that generate an (almost) sensical sentence, but will be cut 
 * off by no reason.
 * 
 * When generating a new name, what it will do is **(nerdy alert)**:
 * - Grab some words offsetted by `nextIndex`, the amount of words it grabbed is controlled by 
 *   the provided `length` parameter in the `roll()` function returned by this factory function.
 * - Increase `nextIndex` so next time, you can grab a different word.
 * - If the generated word is already generated, it will try to generated a different name
 *   but longer, `length + 1` to be exact
 * 
 * @example
 * ```
 * // not really a randomizer to be honest
 * const randomizer = createWordSlidingRandomizer()
 * console.log(randomizer(6))
 * // the_missile_knows_where_it
 * console.log(randomizer(6))
 * // at_all_times_dot_it_knows_this
 * ```
 * @param source any source you want, default is `SRC_MISSILE_DEFAULT`
 * @returns 
 * @see {@link SRC_MISSILE_DEFAULT} - default random set.
 * @see {@link splitAndClean()} - utility function to clean up the source set.
 */
export function createWordSlidingRandomizer(source: string[] = splitAndClean(SRC_MISSILE_DEFAULT)): AnyRandomizerFn {
  const generated = new Set<string>()
  let nextIndex = 0
  return function roll(length) {
    let randomPrefix: string[] = []

    for (let i = 0; i < length; i++) {
      randomPrefix.push(source[nextIndex + i])
    }

    const rolled = randomPrefix.join("_")
    if (generated.has(rolled)) { // if found duplicate
      return roll(length + 1) // reroll with increased length
    }

    generated.add(rolled)
    nextIndex += length - 1
    return rolled
  }
}

/**A factory function that generate only (almost) a single word with the provided source set.
 * 
 * Unlike {@link createWordSlidingRandomizer()} **(nerdy alert again)**:
 * - First it will generate a single word, regardless of the `length` parameter you 
 *   provided (tl:dr - it ignored `length`)
 * - If there's a duplicated word, try mashing the next word
 * - Returns the generated name
 * 
 * @example
 * ```
 * // again, not random at all
 * const randomizer = createSingleWordSlidingRandomizer()
 * for (let i = 0; i <= 13; i++) console.log(randomizer())
 * // the 
 * // missile 
 * // knows 
 * // where 
 * // it 
 * // is 
 * // at 
 * // all 
 * // times
 * // it_knows               <- it found the duplicated word, so it tries
 * // this                      to roll the next word
 * // because 
 * // it_knows_where 
 * // it_isnt
 * ```
 * @param source any source you want, default is `SRC_MISSILE_DEFAULT`
 * @returns 
 * @see {@link SRC_MISSILE_DEFAULT} - default random set.
 * @see {@link splitAndClean()} - utility function to clean up the source set.
 */
export function createSingleWordSlidingRandomizer(
  source: string[] = splitAndClean(`${SRC_MISSILE_DEFAULT} ${SRC_NEOFORGE_DOCS_SET} ${SRC_CAT_SET}`.replaceAll(".", ""))
) {
  const generated = new Set<string>()
  const SOURCE_MAX_LENGTH = source.length
  const MAX_RETRY = 10
  let currentRetry = 0
  let currentWordIndex = 0
  let randomPrefix: string[] = []
  let wordLength = 1
  return function roll(length = wordLength) {
    length = wordLength
    randomPrefix.push(source[currentWordIndex])
    
    const rolled = randomPrefix.join("_")
    if (generated.has(rolled) && currentWordIndex === SOURCE_MAX_LENGTH - 1 && currentRetry === MAX_RETRY) {
      throw new Error("panic: starvation - cannot generate a new name, createSingleWordSlidingRandomizer() has ran out of words.")
    }

    if (generated.has(rolled)) { // if found duplicate
      currentWordIndex += 1
      currentRetry += 1
      return roll(length)
    }

    generated.add(rolled)
    currentWordIndex += 1
    currentRetry = 0
    randomPrefix = []
    return rolled
  }
}