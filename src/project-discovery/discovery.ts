import fs from "node:fs"
import { dplLogger, formatPath, isFileOrDirExist, NotLog4j } from "../utils"
import type { IProjectStat } from "../api"
import { readProjectMetadata } from "./metadata"
import { getProjectLongDescription, parseOtherMarkdownPage } from "./markdownPages"
import { getTotalCommits } from "./repoUtils"
import { appendLicenceUrl } from "./licenceLookUp"

export const LOGGER = new NotLog4j("dpl") // duck's project loader, short-handed

export class DuckProjectLoader {
  constructor(protected readonly targetPath: string) {}

  public async scanForCandidate() {
    LOGGER.info("duck's project loader is scanning for duck project candidate at", formatPath(this.targetPath)) // not a (neo)forge reference :)
  
    const allProjectsName = fs.readdirSync(this.targetPath)
    const canidate = [] as IProjectStat[]
  
    for (const projectFolderName of allProjectsName) {
      const PROJECT_BASE_PATH = `${this.targetPath}/${projectFolderName}`
      const DOT_DUCK_FOLDER = `${PROJECT_BASE_PATH}/.duck` as const
      if (!isFileOrDirExist(DOT_DUCK_FOLDER)) {
        LOGGER.info(".duck metadata folder does not exist for", formatPath(PROJECT_BASE_PATH), ". Skipping...")
        continue
      }
  
      LOGGER.info("Found project candidate:", formatPath(PROJECT_BASE_PATH))
  
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
  
    LOGGER.info("Found", canidate.length, "candidate", "\n\n")

    throw "panic"
  
    return canidate
  }
}