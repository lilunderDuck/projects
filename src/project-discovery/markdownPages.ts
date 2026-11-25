import { getEverythingFrom, readFile } from "../utils";
import { LOGGER } from "./discovery";

export function parseOtherMarkdownPage(dotDuckFolderPath: string) {
  return getEverythingFrom(dotDuckFolderPath)
    // main page, must exclude that out
    .filter(thisThing => !thisThing.includes("description.md"))
    // otherwise grab every markdown file to generate sub-page for each project
    .filter(fileName => fileName.endsWith(".md"))
    .map(fileName => ({
      path: `${dotDuckFolderPath}/${fileName}`,
      content: readFile(`${dotDuckFolderPath}/${fileName}`).asText()
    }))
  // ...
}

export function getProjectLongDescription(dotDuckFolderPath: string) {
  const PROJECT_LONG_DESCRIPTION_PATH = `${dotDuckFolderPath}/description.md` as const
  try {
    return readFile(PROJECT_LONG_DESCRIPTION_PATH).asText()
  } catch(error) {
    LOGGER.info("Could not get the project long description from:", PROJECT_LONG_DESCRIPTION_PATH)
    return ''
  }
}