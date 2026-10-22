import { createRegistry } from "../utils"
import type { IProjectStat } from "./data"

type ProjectStatusRegistry = Record<IProjectStat["status"], {
  color: string
  description: string
}>

export const PROJECT_STATUS_REGISTRY = createRegistry<ProjectStatusRegistry>({
  active: {
    color: "var(--green)",
    description: "mint_duck is currently active on maintaining this"
  },
  paused: {
    color: "var(--yellow)",
    description: "mint_duck is currently pausing this project and will go back to maintain it later"
  },
  completed: {
    color: "var(--sapphire)",
    description: "mint_duck is finished doing this project (at least for now)"
  },
  stopped: {
    color: "var(--red)",
    description: "mint_duck has stopped maintaining this project (due to motivation loss for example)"
  }
})

export const PROJECT_TYPE_COLOR_MAPPING = createRegistry<Record<IProjectStat["type"], string>>({
  private: "var(--mauve)",
  public: "var(--flamingo)"
})