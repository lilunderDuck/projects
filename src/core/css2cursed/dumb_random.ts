/**Adapted from: 
 * - [`The missle knows where it is at all times`](https://copypastatext.com/the-missile-knows-where-it-is/)
 */
const SRC_MISSILE_DEFAULT = `
The missile knows where it is at all times. It knows this because it knows where it isn't. By subtracting where it is from where it isn't, or where it isn't from where it is (whichever is greater), it obtains a difference, or deviation. The guidance subsystem uses deviations to generate corrective commands to drive the missile from a position where it is to a position where it isn't, and arriving at a position where it wasn't, it now is. Consequently, the position where it is, is now the position that it wasn't, and it follows that the position that it was, is now the position that it isn't.

In the event that the position that it is in is not the position that it wasn't, the system has acquired a variation, the variation being the difference between where the missile is, and where it wasn't. If variation is considered to be a significant factor, it too may be corrected by the GEA. However, the missile must also know where it was.

The missile guidance computer scenario works as follows. Because a variation has modified some of the information the missile has obtained, it is not sure just where it is. However, it is sure where it isn't, within reason, and it knows where it was. It now subtracts where it should be from where it wasn't, or vice-versa, and by differentiating this from the algebraic sum of where it shouldn't be, and where it was, it is able to obtain the deviation and its variation, which is called error.
`

/**Adapted from: 
 * - [`Cat - From Wikipedia, the free encyclopedia`](https://en.wikipedia.org/wiki/Cat)
 */
export const SRC_CAT_SET = `
The cat (Felis catus), also called domestic cat and house cat, is a small domesticated carnivorous mammal. It is a member of Felidae, the family of mammals in the order Carnivora also colloquially referred to as cats. An obligate carnivore requiring a predominantly meat-based diet, it has retractable claws adapted to killing small prey species such as mice and rats. It has a strong, flexible body, quick reflexes, and sharp teeth, and its night vision and sense of smell are well developed. It is a social species, but a solitary hunter and a crepuscular predator. Cat communication includes meowing, purring, trilling, hissing, growling, grunting, body language, and scent marking. It can hear sounds too faint or too high in frequency for human ears, such as those made by small mammals. It secretes and perceives pheromones. Cat intelligence is evident in its ability to adapt, learn through observation, and solve problems. The domestic cat is the only domesticated species of the family Felidae.
`

export function createRandomizer(srcSet: string) {
  const SOURCE_SET = srcSet
    .replaceAll(' ', '')
    .replaceAll('\n', '')
    .replaceAll(/\.|,|'|"|\(|\)/g, '')
  // ...

  let currentCharIndex = 0
  const generated = new Set<string>()

  const reroll = (nextChar: string, numberPrefix = 0) => {
    let generatedChar = nextChar
    if (numberPrefix != 0) {
      generatedChar = `${nextChar}${numberPrefix}`
    }

    if (generated.has(generatedChar)) {
      numberPrefix += 1
      return reroll(nextChar, numberPrefix)
    }

    if (numberPrefix != 0) {
      nextChar = generatedChar
    }

    generated.add(nextChar)
    return nextChar
  }

  return {
    next() {
      let nextChar = SOURCE_SET[currentCharIndex]!
      const rolled = reroll(nextChar)
      currentCharIndex += 1
      return rolled
    }
  }
}

function dumbHashNonRandom() {
  const SOURCE_SET = SRC_CAT_SET
    .replaceAll('\n', '')
    .replaceAll(/\.|,|'|"|\(|\)/g, '')
    .split(" ")
  // ...

  let currentIndex = 0

  const rotateLeft = (n: number, r: number) => n << r | n >>> 32 - r

  return {
    next() {
      const rolledWord = SOURCE_SET[currentIndex]! + SOURCE_SET[currentIndex + 1]! + SOURCE_SET[currentIndex + 2]!
      let rolledWordSum = 0
      for (let i = 0; i < rolledWord.length; i++) {
        rolledWordSum += (rolledWord.codePointAt(i) ?? 0x0003be) << 2 // "mint_duck" as char sum
      }

      let a = rolledWordSum ^ 2 << 16, b = rolledWordSum | 0xaa55, c1 = 0x0000d00, c2 = 42, t = c1 ^ c2
      a = Math.imul(rotateLeft(a ^ t, 16), c1);
      b = Math.imul(rotateLeft(b, 16) ^ t, c2);
      currentIndex += 3
      let result = (a + b) | t << rolledWordSum
      if (result < 0) {
        result *= -1
      }
      return "_" + (result).toString(16);
    }
  }
}

export const HASH_RANDOMIZER = dumbHashNonRandom()
export const RANDOMIZER = createRandomizer(SRC_MISSILE_DEFAULT)

if (import.meta.main) {
  for (let i = 0; i < 30; i++) {
    console.log(RANDOMIZER.next())
  }
}
