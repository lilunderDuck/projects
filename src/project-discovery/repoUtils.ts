import { ShellExec } from "../utils"

export async function getTotalCommits(projectFolderPath: string) {
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