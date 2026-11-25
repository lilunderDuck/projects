import fs from "node:fs"
import { formatPath, isFileOrDirExist, NotLog4j } from "../utils"
import { readProjectMetadata } from "./metadata"
import { ProjectType } from "../api"

export const LOGGER = new NotLog4j("dpl") // duck's project loader, short-handed

export async function scanForCandidate(targetPath: string) {
  LOGGER.info("duck's project loader is scanning for duck project candidate at", formatPath(targetPath)) // not a (neo)forge reference :)

  const allProjectsName = fs.readdirSync(targetPath)
  const PROJECTS_CANDIDATE = []
  const PROJECT_GROUPS_CANDIDATE = []

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

    const metadata = await readProjectMetadata(PROJECT_BASE_PATH, DOT_DUCK_FOLDER)
    if (!metadata) {
      continue
    }

    if (metadata.projectType === ProjectType.GROUP) {
      PROJECT_GROUPS_CANDIDATE.push(metadata)
    } else {
      PROJECTS_CANDIDATE.push(metadata)
    }
  }

  LOGGER.info("Found", PROJECTS_CANDIDATE.length, "project(s) candidate,", PROJECT_GROUPS_CANDIDATE.length, "group(s) candidate.\n\n")
  
  throw "stop"
}