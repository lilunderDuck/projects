import { formatPath, ShellExec } from "../utils"
import { LOGGER } from "./discovery"

export async function getTotalCommits(projectFolderPath: string) {
  LOGGER.info("|  Getting total commits from", formatPath(projectFolderPath))
  return new ShellExec<number>(["cd", projectFolderPath, "&&", "git", "rev-list", "--count", "HEAD"])
    .getAsInt()
    .orElseDefault(0)
    .executeDangerously()
  // ...
}

// TODO:
export async function getLastCommitMessages(projectFolderPath: string, amount: number) {
  const output = await new ShellExec<string>(["cd", projectFolderPath, "&&", "git", "log", "--oneline", "-n", amount])
    .orElseDefault('')
    .executeDangerously()
  // ...

  // console.log(output)
}