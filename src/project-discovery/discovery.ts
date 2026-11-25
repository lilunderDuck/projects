import fs from "node:fs"
import { formatPath, isFileOrDirExist, NotLog4j, readFile } from "../utils"
import { ProjectGroupMetadata, ProjectMetadata, ProjectType, type AnyProject, type AnyProjectStat, type IBaseProjectStat, type IProjectGroupStat, type IProjectStat } from "../api"
import { getProjectLongDescription, parseOtherMarkdownPage } from "./markdownPages"
import { getTotalCommits } from "./repoUtils"

export const LOGGER = new NotLog4j("dpl") // duck's project loader, short-handed

export class ProjectLoader {
  public readonly CANDIDATE: AnyProjectStat[] = []
  readonly ATTACHED_DATA = new Map<string, AnyProjectStat>()
  constructor(protected readonly TARGET_PATH: string) {}
  
  public async scanForCandidate() {
    // @ts-ignore - we don't talk about why there's a ts-ignore here...
    this.CANDIDATE = await this.scanForProjectCandidate(this.TARGET_PATH)
  }

  protected async scanForProjectCandidate(targetPath: string, baseFolderName = "") {
    const allProjectsFolder = fs.readdirSync(targetPath)

    console.log()
    LOGGER.info("Scanning project candidate at", formatPath(targetPath))
    
    const candidate: AnyProjectStat[] = []

    for (const projectFolderName of allProjectsFolder) {
      if (projectFolderName === ".duck") continue
      if (!this.existDuckFolderIn(baseFolderName, projectFolderName)) continue

      const metadata = this.parseMetadata(projectFolderName, baseFolderName)
      if (!metadata) continue

      LOGGER.warn("Found project candidate", formatPath(projectFolderName))

      metadata.__folderName = projectFolderName
      const attachedData = await this.attachData(metadata, baseFolderName)

      candidate.push(attachedData)
      LOGGER.info("registered:", formatPath(projectFolderName), "project type=", attachedData.projectType)
    }
    
    LOGGER.info("found", candidate.length, "candidate(s)")
    return candidate
  }

  protected parseMetadata(projectFolderName: string, baseFolderName: string) {
    const metadata = readFile(`${this.getDotDuckPath(projectFolderName, baseFolderName)}/metadata.json`)
      .asJSON<AnyProject & { __folderName: string }>()
    // ...

    const isGroupProject = metadata.type === "group"
    const schema = isGroupProject ? ProjectGroupMetadata : ProjectMetadata
    const containsError = schema.safeParse(metadata).error
    if (containsError) {
      // TODO: print out parsing error
      return null
    }

    return metadata
  }

  protected async attachData(metadataRef: AnyProject & { __folderName: string }, baseFolderName: string) {
    LOGGER.info("Attaching additional data for found project candidate")
    const currentProjectPath = this.getProjectPath(metadataRef.__folderName, baseFolderName)
    const dotDuckPath = this.getDotDuckPath(metadataRef.__folderName, baseFolderName)

    let assetsPath: string | null = null
    if (isFileOrDirExist(`${dotDuckPath}/assets`)) {
      assetsPath = `${dotDuckPath}/assets`
    }

    const baseData = {
      assetsPath,
      projectType: metadataRef.type === "group" ? ProjectType.GROUP : ProjectType.PROJECT,
      longDescription: getProjectLongDescription(dotDuckPath)
    } as IBaseProjectStat

    if (metadataRef.type === "group") return {
      ...metadataRef,
      ...baseData,
      pages: parseOtherMarkdownPage(dotDuckPath),
      totalCommits: await getTotalCommits(currentProjectPath),
      projects: await this.scanForProjectCandidate(currentProjectPath, metadataRef.__folderName) as IProjectStat[]
    } as IProjectGroupStat
    
    return {
      ...metadataRef,
      ...baseData,
      pages: parseOtherMarkdownPage(dotDuckPath),
      totalCommits: await getTotalCommits(currentProjectPath),
      assetsPath,
      projectType: ProjectType.PROJECT,
      longDescription: getProjectLongDescription(dotDuckPath)
    } as IProjectStat
  }

  public async render(page: (metadata: AnyProjectStat) => Promise<void>) {
    LOGGER.info("Begin rendering everything...")
    await Promise.all(this.CANDIDATE.map(it => page(it)))
  }

  protected existDuckFolderIn(baseFolderName: string, projectFolderName: string) {
    const folderPath = baseFolderName === "" ? projectFolderName : `${baseFolderName}/${projectFolderName}`
    const PROJECT_BASE_PATH = this.getProjectPath(folderPath)
    const DOT_DUCK_FOLDER = this.getDotDuckPath(folderPath)
    if (!isFileOrDirExist(DOT_DUCK_FOLDER)) {
      LOGGER.warn(".duck metadata folder does not exist at", formatPath(PROJECT_BASE_PATH), ". Skipping...")
      return false
    }
    
    const PROJECT_METADATA_PATH = `${DOT_DUCK_FOLDER}/metadata.json` as const
    if (!isFileOrDirExist(PROJECT_METADATA_PATH)) {
      LOGGER.warn("missing project metadata.json on .duck folder at", PROJECT_METADATA_PATH, ". Skipping...")
      return false
    }

    return true
  }

  protected getProjectPath<const T extends string>(folderName: T, baseFolderName = "") {
    const folderPath = baseFolderName === "" ? folderName : `${baseFolderName}/${folderName}`
    return `${this.TARGET_PATH}/${folderPath}` as const
  }
  
  protected getDotDuckPath<const T extends string>(folderName: T, baseFolderName = "") {
    const folderPath = baseFolderName === "" ? folderName : `${baseFolderName}/${folderName}`
    return `${this.getProjectPath(folderPath)}/.duck` as const
  }
}