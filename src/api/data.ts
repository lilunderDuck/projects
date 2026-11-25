import * as z from "zod"
import { nonEmptyString, unionOf } from "../utils"
import { Children } from "react"

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
  }))
}, "Project metadata must be an object")

export const ProjectGroupMetadata = z.object({
  title: nonEmptyString(),
  id: nonEmptyString(),
  description: nonEmptyString(),
  icon: nonEmptyString(),
  banner: nonEmptyString().optional(),
  Children: z.array(z.string())
}, "Project group metadata must be an object")

export type ProjectMetadataSchema = z.infer<typeof ProjectMetadata>
export type ProjectGroupMetadataSchema = z.infer<typeof ProjectGroupMetadata>

export interface IProjectStat extends Omit<ProjectMetadataSchema, "licence"> {
  longDescription: string
  totalCommits: number
  licence?: {
    name: string | LicenceNameNone
    url?: string
    why?: string
  }[]
  pages: { path: string, content: string }[]
  assetsPath: string | null
}