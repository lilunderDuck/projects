import { ProjectMetadata, type ProjectMetadataSchema } from "../api"
import { isFileOrDirExist, readFile } from "../utils"
import { LOGGER } from "./discovery"

export function readProjectMetadata(dotDuckFolderPath: string) {
  const PROJECT_METADATA_PATH = `${dotDuckFolderPath}/metadata.json` as const
  if (!isFileOrDirExist(PROJECT_METADATA_PATH)) {
    LOGGER.warn("missing project metadata.json on .duck folder at", PROJECT_METADATA_PATH, ". Skipping...")
    return null
  }

  try {
    const metadata = readFile(PROJECT_METADATA_PATH).asJSON<ProjectMetadataSchema>()
    if (ProjectMetadata.safeParse(metadata).error) {
      LOGGER.warn("invalid metadata.json on .duck folder at", PROJECT_METADATA_PATH, ". Skipping...")
      return null
    }
    return metadata
  } catch(error) {
    LOGGER.warn("could not parse metadata.json on .duck folder at", PROJECT_METADATA_PATH, ". Skipping...")
    return null
  }
}