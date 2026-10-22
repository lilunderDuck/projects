import fs from "node:fs"
import { copyDir, isFileOrDirExist, readFile, ShellExec } from "../utils"
import type { IProjectMetadata, IProjectStat } from "../data"
import { LICENSE_REGISTRY } from "../data/licenseRegistry"

interface IProjectCandiate {
  metadata: IProjectMetadata
  longDescription: string | null
  assetsPath: string | null
}

export async function scanForProjectCandidate(basePath: string) {
  const PROJECTS_ON_BASE_PATH = fs.readdirSync(basePath)
  const canidate = [] as IProjectStat[]
  for (const projectFolderName of PROJECTS_ON_BASE_PATH) {
    const PROJECT_BASE_PATH = `${basePath}/${projectFolderName}`
    const DUCK_METADATA_FOLDER = `${PROJECT_BASE_PATH}/.duck` as const
    if (!isFileOrDirExist(DUCK_METADATA_FOLDER)) {
      console.log(".duck metadata folder does not exist for", PROJECT_BASE_PATH, ". Skipping...")
      continue
    }
    
    const PROJECT_METADATA_PATH = `${DUCK_METADATA_FOLDER}/metadata.json` as const
    if (!isFileOrDirExist(PROJECT_METADATA_PATH)) {
      console.log("missing project metadata.json on .duck folder at", PROJECT_BASE_PATH, ". Skipping...")
      continue
    }

    const PROJECT_LONG_DESCRIPTION_PATH = `${DUCK_METADATA_FOLDER}/description.md` as const
    const PROJECT_ASSETS_FOLDER = `${DUCK_METADATA_FOLDER}/assets` as const

    const projectMetadata = readFile(PROJECT_METADATA_PATH).asJSON<IProjectMetadata>()
    const projectLongDescriptionContent = readFile(PROJECT_LONG_DESCRIPTION_PATH).asText()
    const newData: IProjectStat = {
      ...projectMetadata,
      totalCommits: await getTotalCommitFromProject(PROJECT_BASE_PATH),
      longDescription: projectLongDescriptionContent,
    }

    newData.licence = projectMetadata.licence ? projectMetadata.licence.map(it => ({
      ...it,
      // @ts-ignore
      url: LICENSE_REGISTRY.getOrElseThrow(it.name?.toLowerCase()!),
    })) : undefined

    copyDir(PROJECT_ASSETS_FOLDER, "./docs/assets")

    canidate.push(newData)
  }

  return canidate
}

function getTotalCommitFromProject(projectPath: string) {
  return new ShellExec<number>(["cd", projectPath, "&&", "git", "rev-list", "--count", "HEAD"])
    .getAsInt()
    .orElseDefault(0)
    .executeDangerously()
  // ...
}

async function getLastCommitMessages(projectPath: string, amount: number) {
  const output = await new ShellExec<string>(["cd", projectPath, "&&", "git", "log", "--oneline", "-n", amount])
    .orElseDefault('')
    .executeDangerously()
  // ...

  // console.log(output)
}