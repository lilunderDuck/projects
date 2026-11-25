import fs from "node:fs"
import { formatPath, isFileOrDirExist, NotLog4j, readFile } from "../utils"
import { createProjectGroupLoader, createProjectLoader } from "./metadata"

export const LOGGER = new NotLog4j("dpl") // duck's project loader, short-handed
const PROJECTS = createProjectLoader()
const PROJECT_GROUPS = createProjectGroupLoader()
const LOADERS = [PROJECTS, PROJECT_GROUPS]

export async function scanForCandidate(targetPath: string) {
  LOGGER.info("duck's project loader is scanning for duck project candidate at", formatPath(targetPath)) // not a (neo)forge reference :)

  const allProjectsName = fs.readdirSync(targetPath)

  for (const projectFolderName of allProjectsName) {
    console.log("")
    LOGGER.info("Currently looking for:", formatPath(projectFolderName))
    
    const PROJECT_BASE_PATH = `${targetPath}/${projectFolderName}`
    const DOT_DUCK_FOLDER = `${PROJECT_BASE_PATH}/.duck` as const
    if (!isFileOrDirExist(DOT_DUCK_FOLDER)) {
      LOGGER.info("|  .duck metadata folder does not exist for", formatPath(PROJECT_BASE_PATH), ". Skipping...")
      continue
    }
    
    LOGGER.info("Found project candidate:", formatPath(PROJECT_BASE_PATH))

    const PROJECT_METADATA_PATH = `${DOT_DUCK_FOLDER}/metadata.json` as const
    if (!isFileOrDirExist(PROJECT_METADATA_PATH)) {
      LOGGER.warn("|  missing project metadata.json on .duck folder at", PROJECT_METADATA_PATH, ". Skipping...")
      continue
    }

    const metadata = readFile(PROJECT_METADATA_PATH).asJSON<any>()
    for (const loader of LOADERS) {
      const projectMetadata = loader.parse(metadata)
      if (projectMetadata) {
        await loader.commit(PROJECT_BASE_PATH, DOT_DUCK_FOLDER, projectMetadata as any)
      } else {
        LOGGER.warn("|  Not committing changes into", loader.name)
      }
    }
  }

  LOGGER.info("Found", PROJECTS.candidate.length, "project(s) candidate,", PROJECT_GROUPS.candidate.length, "group(s) candidate.\n\n")
  
  throw "stop"
}