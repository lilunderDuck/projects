import * as z from "zod"
import { nonEmptyString, unionOf } from "../utils"

type LicenceNameNone = null

export const ProjectMetadata = z.object({
  type: unionOf("private", "public"),
  status: unionOf("active", "paused", "completed", "stopped"),
  title: nonEmptyString(),
  id: nonEmptyString(),
  repoUrl: nonEmptyString().optional(),
  description: nonEmptyString(),
  icon: nonEmptyString(),
  banner: nonEmptyString().optional(),
  licence: z.array(z.object({
    name: nonEmptyString().or(z.literal(null)),
    why: nonEmptyString().optional()
  })).optional()
}, "Project metadata must be an object")

export const ProjectGroupMetadata = z.object({
  type: unionOf("group"),
  title: nonEmptyString(),
  id: nonEmptyString(),
  description: nonEmptyString(),
  icon: nonEmptyString(),
  banner: nonEmptyString().optional(),
}, "Project group metadata must be an object")

export type ProjectMetadataSchema = z.infer<typeof ProjectMetadata>
export type ProjectGroupMetadataSchema = z.infer<typeof ProjectGroupMetadata>
export type AnyProject = 
  ProjectGroupMetadataSchema | 
  ProjectMetadataSchema

export const enum ProjectType {
  PROJECT,
  GROUP
}

export interface IBaseProjectStat {
  assetsPath: string | null
  longDescription: string
  projectType: ProjectType
  pages: { path: string, content: string }[]
}

export interface IProjectStat extends IBaseProjectStat, ProjectMetadataSchema {
  totalCommits: number
  projectType: ProjectType.PROJECT
}

export interface IProjectGroupStat extends IBaseProjectStat, ProjectGroupMetadataSchema {
  projectType: ProjectType.GROUP
  projects: IProjectStat[]
}

export type AnyProjectStat = 
  IProjectStat |
  IProjectGroupStat