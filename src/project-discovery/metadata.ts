import type zod from "zod"
// ...
import { ProjectGroupMetadata, ProjectMetadata, type IProjectStat, type ProjectGroupMetadataSchema, type ProjectMetadataSchema } from "../api"
import { isFileOrDirExist } from "../utils"
import { appendLicenceUrl } from "./licenceLookUp"
import { getProjectLongDescription, parseOtherMarkdownPage } from "./markdownPages"
import { getTotalCommits } from "./repoUtils"

function createParser<T extends zod.ZodObject>(schema: T) {
  return (incomingData: any) => {
    const containsError = schema.safeParse(incomingData).error
    if (containsError) {
      return null
    }

    return incomingData as zod.infer<T>
  }
}

interface IProjectMetadataLoader<T> {
  readonly candidate: T[]
  readonly name: string
  parse(incomingData: any): T | null
  commit(projectBasePath: string, dotDuckFolderPath: string, data: T): Promise<void> | void
}

export function createProjectLoader(): IProjectMetadataLoader<ProjectMetadataSchema> {
  const candidate: ProjectMetadataSchema[] = []
  return {
    name: "projects",
    candidate: candidate,
    parse: createParser(ProjectMetadata),
    async commit(projectBasePath, dotDuckFolderPath, data) {
      let assetsPath: string | null = null
      if (isFileOrDirExist(`${dotDuckFolderPath}/assets`)) {
        assetsPath = `${dotDuckFolderPath}/assets`
      }

      const stat: IProjectStat = {
        ...(data as ProjectMetadataSchema),
        longDescription: getProjectLongDescription(dotDuckFolderPath),
        pages: parseOtherMarkdownPage(dotDuckFolderPath),
        totalCommits: await getTotalCommits(projectBasePath),
        assetsPath
      }
  
      appendLicenceUrl(stat, data)
      candidate.push(stat)
    }
  }
}

export function createProjectGroupLoader(): IProjectMetadataLoader<ProjectGroupMetadataSchema> {
  const candidate: ProjectGroupMetadataSchema[] = []
  return {
    name: "project groups",
    candidate: candidate,
    parse: createParser(ProjectGroupMetadata),
    commit(projectBasePath, dotDuckFolderPath, data) {
      candidate.push(data)
    }
  }
}