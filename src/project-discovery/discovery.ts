import fs from "node:fs"
import { formatPath, isFileOrDirExist, NotLog4j, readFile } from "../utils"
import { ProjectGroupMetadata, ProjectMetadata, ProjectType, type AnyProject, type AnyProjectStat, type IBaseProjectStat, type IProjectGroupStat, type IProjectStat } from "../api"
import { getProjectLongDescription, parseOtherMarkdownPage } from "./markdownPages"
import { getTotalCommits } from "./repoUtils"

export const LOGGER = new NotLog4j("dpl") // duck's project loader, short-handed

export class ProjectLoader {
  readonly CANDIDATE = new Map<string, AnyProjectStat>()
  readonly ATTACHED_DATA = new Map<string, AnyProjectStat>()
  constructor(protected readonly TARGET_PATH: string) {}
  
  public scanForCandidate() {
    this.scanForProjectCandidate(this.TARGET_PATH)
  }

  protected async scanForProjectCandidate(targetPath: string) {
    const allProjectsFolder = fs.readdirSync(targetPath)

    console.log()
    LOGGER.info("Scanning project candidate at", formatPath(targetPath))

    for (const projectFolderName of allProjectsFolder) {
      if (projectFolderName === ".duck") continue
      if (!this.existDuckFolderIn(projectFolderName)) continue

      const metadata = readFile(`${this.getDotDuckPath(projectFolderName)}/metadata.json`)
        .asJSON<AnyProject & { __folderName: string }>()
      // ...

      const isGroupProject = metadata.type === "group"
      const schema = isGroupProject ? ProjectGroupMetadata : ProjectMetadata
      const containsError = schema.safeParse(metadata).error
      if (containsError) {
        // TODO: print out parsing error
        continue
      }

      if (isGroupProject) {
        this.scanForProjectCandidate(this.getProjectPath(projectFolderName))
      }

      metadata.__folderName = projectFolderName
      const attachedData = await this.attachData(metadata)

      this.CANDIDATE.set(metadata.id, attachedData)
      LOGGER.info("registered:", formatPath(projectFolderName))
    }
  }

  protected async attachData(metadataRef: AnyProject & { __folderName: string }) {
    LOGGER.info("Attaching additional data for found project candidate")
    let assetsPath: string | null = null
    if (isFileOrDirExist(`${this.getDotDuckPath(metadataRef.__folderName)}/assets`)) {
      assetsPath = `${this.getDotDuckPath(metadataRef.__folderName)}/assets`
    }

    const baseData = {
      assetsPath,
      projectType: metadataRef.type === "group" ? ProjectType.GROUP : ProjectType.PROJECT,
      longDescription: getProjectLongDescription(this.getDotDuckPath(metadataRef.__folderName))
    } as IBaseProjectStat

    if (metadataRef.type === "group") return {
      ...metadataRef,
      ...baseData,
      pages: parseOtherMarkdownPage(this.getDotDuckPath(metadataRef.__folderName)),
      totalCommits: await getTotalCommits(this.getProjectPath(metadataRef.__folderName)),
    } as IProjectGroupStat
    
    return {
      ...metadataRef,
      ...baseData,
      pages: parseOtherMarkdownPage(this.getDotDuckPath(metadataRef.__folderName)),
      totalCommits: await getTotalCommits(this.getProjectPath(metadataRef.__folderName)),
      assetsPath,
      projectType: ProjectType.PROJECT,
      longDescription: getProjectLongDescription(this.getDotDuckPath(metadataRef.__folderName))
    } as IProjectStat
  }

  public render(page: (metadata: AnyProject, attachedData: any) => void) {
    for (const [projectId, metadataRef] of this.CANDIDATE) {
      page(metadataRef, this.ATTACHED_DATA.get(projectId))
    }
  }

  protected existDuckFolderIn(projectFolderName: string) {
    const PROJECT_BASE_PATH = this.getProjectPath(projectFolderName)
    const DOT_DUCK_FOLDER = this.getDotDuckPath(projectFolderName)
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

  public candidate() {
    return this.CANDIDATE
  }

  protected getProjectPath(folderName: string) {
    return `${this.TARGET_PATH}/${folderName}`
  }

  protected getDotDuckPath(folderName: string) {
    return `${this.getProjectPath(folderName)}/.duck`
  }
}