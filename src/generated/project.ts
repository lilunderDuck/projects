import fs from "node:fs"
import { getEverythingFrom, isFileOrDirExist, readFile, ShellExec } from "../utils"
import type { IProjectMetadata, IProjectStat } from "../data"
import { LICENSE_REGISTRY } from "../data/licenseRegistry"
import { dplLogger, formatPath } from "../core"

export async function scanForProjectCandidate(basePath: string) {
  dplLogger.info("duck's project loader is scanning for duck project canidate at", formatPath(basePath)) // not a (neo)forge reference :)

  const allProjectsName = fs.readdirSync(basePath)
  const canidate = [] as IProjectStat[]

  for (const projectFolderName of allProjectsName) {
    const PROJECT_BASE_PATH = `${basePath}/${projectFolderName}`
    const DOT_DUCK_FOLDER = `${PROJECT_BASE_PATH}/.duck` as const
    if (!isFileOrDirExist(DOT_DUCK_FOLDER)) {
      dplLogger.info(".duck metadata folder does not exist for", formatPath(PROJECT_BASE_PATH), ". Skipping...")
      continue
    }

    let assetsPath: string | null = null
    if (isFileOrDirExist(`${DOT_DUCK_FOLDER}/assets`)) {
      assetsPath = `${DOT_DUCK_FOLDER}/assets`
    }

    const projectMetadata = readProjectMetadata(DOT_DUCK_FOLDER)
    if (projectMetadata === null) continue

    const stat: IProjectStat = {
      ...projectMetadata,
      longDescription: getProjectLongDescription(DOT_DUCK_FOLDER),
      pages: parseOtherMarkdownPage(DOT_DUCK_FOLDER),
      totalCommits: await getTotalCommits(PROJECT_BASE_PATH),
      assetsPath
    }

    appendLicenceUrl(stat, projectMetadata)

    canidate.push(stat)
  }

  dplLogger.info("Found", canidate.length, "candidate", "\n\n")

  return canidate
}

function parseOtherMarkdownPage(dotDuckFolderPath: string) {
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


function readProjectMetadata(dotDuckFolderPath: string) {
  const PROJECT_METADATA_PATH = `${dotDuckFolderPath}/metadata.json` as const
  if (!isFileOrDirExist(PROJECT_METADATA_PATH)) {
    dplLogger.warn("missing project metadata.json on .duck folder at", PROJECT_METADATA_PATH, ". Skipping...")
    return null
  }

  return readFile(PROJECT_METADATA_PATH).asJSON<IProjectMetadata>()
}

function getProjectLongDescription(dotDuckFolderPath: string) {
  const PROJECT_LONG_DESCRIPTION_PATH = `${dotDuckFolderPath}/description.md` as const
  try {
    return readFile(PROJECT_LONG_DESCRIPTION_PATH).asText()
  } catch(error) {
    dplLogger.info("Could not get the project long description from:", PROJECT_LONG_DESCRIPTION_PATH)
    return ''
  }
}

function appendLicenceUrl(dataRef: IProjectStat, metadata: IProjectMetadata) {
  dataRef.licence = metadata.licence ? metadata.licence.map(it => ({
    ...it,
    // @ts-ignore
    url: LICENSE_REGISTRY.getOrElseThrow(it.name?.toLowerCase()!),
  })) : undefined
}

async function getTotalCommits(projectFolderPath: string) {
  return new ShellExec<number>(["cd", projectFolderPath, "&&", "git", "rev-list", "--count", "HEAD"])
    .getAsInt()
    .orElseDefault(0)
    .executeDangerously()
  // ...
}

// TODO:
async function getLastCommitMessages(projectFolderPath: string, amount: number) {
  const output = await new ShellExec<string>(["cd", projectFolderPath, "&&", "git", "log", "--oneline", "-n", amount])
    .orElseDefault('')
    .executeDangerously()
  // ...

  // console.log(output)
}