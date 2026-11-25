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
  title: nonEmptyString(),
  id: nonEmptyString(),
  description: nonEmptyString(),
  icon: nonEmptyString(),
  banner: nonEmptyString().optional(),
  children: z.array(z.string())
}, "Project group metadata must be an object")

export type ProjectMetadataSchema = z.infer<typeof ProjectMetadata>
export type ProjectGroupMetadataSchema = z.infer<typeof ProjectGroupMetadata>

export const enum ProjectType {
  PROJECT,
  GROUP
}

export interface IBaseProjectStat<T extends ProjectType> {
  assetsPath: string | null
  longDescription: string
  projectType: T
}

export interface IProjectStat extends Omit<ProjectMetadataSchema, "licence">, IBaseProjectStat<ProjectType.PROJECT> {
  totalCommits: number
  licence?: {
    name: string | LicenceNameNone
    url?: string
    why?: string
  }[]
  pages: { path: string, content: string }[]
}

export interface IProjectGroupStat extends Omit<ProjectGroupMetadataSchema, "children">, IBaseProjectStat<ProjectType.GROUP> {
  children: IProjectGroupStat[]
}