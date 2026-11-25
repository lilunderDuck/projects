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

export interface IBaseProjectStat<T extends ProjectType> {
  assetsPath: string | null
  longDescription: string
  projectType: T
}

export interface IProjectStat extends IBaseProjectStat<ProjectType.PROJECT> {
  totalCommits: number
  pages: { path: string, content: string }[]
}

export interface IProjectGroupStat extends IBaseProjectStat<ProjectType.GROUP> {
  children: IProjectGroupStat[]
}

export type AnyProjectStat = 
  IProjectStat |
  IProjectGroupStat