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

export function copyDir(fromPath: string, toPath: string) {
  fs.cpSync(fromPath, toPath, { recursive: true })
}

export function getEverythingFrom<const T extends string>(somePath: T) {
  return fs.readdirSync(somePath, { recursive: true }) as string[]
}

export function ensureDirExist<const T extends string>(path: T) {
  fs.mkdirSync(path, { recursive: true })
}