import fs from "node:fs"

export function isFileOrDirExist(onThisPath: string) {
  return fs.existsSync(onThisPath)
}

export function readFile(from: string) {
  const fileContent = fs.readFileSync(from, { encoding: "utf-8" })
  return {
    asText: () => fileContent,
    asJSON: <T extends any>() => JSON.parse(fileContent) as T
  }
}