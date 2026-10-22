export interface IProjectStat {
  type: "private" | "public"
  status: "active" | "paused" | "completed" | "stopped"
  title: string
  id: string
  repoUrl?: string
  description: string
  longDescription: string[]
  coverImage?: string
  totalCommits?: string // WORKAROUND: currently didn't found why numbers aren't rendered
  previewImages?: string[]
  icon: string
  licence?: {
    name: string | null
    url?: string
    why?: string
  }[]
  disabled?: boolean
}