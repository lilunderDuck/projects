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
  }))
}, "Project metadata must be an object")

export type ProjectMetadataSchema = z.infer<typeof ProjectMetadata>

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