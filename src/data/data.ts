type LicenceNameNone = null

export interface IProjectMetadata {
  type: "private" | "public"
  status: "active" | "paused" | "completed" | "stopped"
  title: string
  id: string
  repoUrl?: string
  description: string
  licence?: {
    name: string | LicenceNameNone
    why?: string
  }[]
  icon: string
}

export interface IProjectStat extends Omit<IProjectMetadata, "licence"> {
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