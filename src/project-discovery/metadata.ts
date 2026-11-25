import type zod from "zod"
// ...
import { LICENSE_REGISTRY, ProjectGroupMetadata, ProjectMetadata, ProjectType, type IProjectGroupStat, type IProjectStat, type ProjectGroupMetadataSchema, type ProjectMetadataSchema } from "../api"
import { isFileOrDirExist, readFile } from "../utils"
import { getProjectLongDescription, parseOtherMarkdownPage } from "./markdownPages"
import { getTotalCommits } from "./repoUtils"

export async function readProjectMetadata(projectBasePath: string, dotDuckFolderPath: string) {
  let assetsPath: string | null = null
  if (isFileOrDirExist(`${dotDuckFolderPath}/assets`)) {
    assetsPath = `${dotDuckFolderPath}/assets`
  }

  const metadata = readFile(`${dotDuckFolderPath}/metadata.json`).asJSON<ProjectMetadataSchema | ProjectGroupMetadataSchema>()

  if ('children' in metadata) {
    return parseAndAttachIfCan<IProjectGroupStat>(metadata, ProjectGroupMetadata, {
      longDescription: getProjectLongDescription(dotDuckFolderPath),
      assetsPath,
      children: [],
      projectType: ProjectType.GROUP
    })
  }

  return parseAndAttachIfCan<IProjectStat>(metadata, ProjectMetadata, {
    longDescription: getProjectLongDescription(dotDuckFolderPath),
    assetsPath,
    pages: parseOtherMarkdownPage(dotDuckFolderPath),
    totalCommits: await getTotalCommits(projectBasePath),
    licence: metadata.licence ? metadata.licence.map(it => ({
      ...it,
      url: LICENSE_REGISTRY.getOrElseThrow(
        // @ts-ignore
        it.name!.toLowerCase()!
      ),
    })) : undefined,
    projectType: ProjectType.PROJECT
  })
}

function parseAndAttachIfCan<T extends object>(incomingData: any, schema: zod.ZodObject, data: Partial<T>) {
  const containsError = schema.safeParse(incomingData).error
  if (containsError) {
    return null
  }

  return {
    ...incomingData,
    ...data
  } as T
}