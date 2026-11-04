import fs from "node:fs"
import path from "node:path"

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

export function writeFile(to: string, content: any) {
  ensureDirExist(path.dirname(to))
  let contentToWrite = ""
  if (typeof content === "string") {
    contentToWrite = content
  } else {
    contentToWrite = JSON.stringify(content)
  }
  fs.writeFileSync(to, contentToWrite)
}

export function copyDir(fromPath: string, toPath: string) {
  ensureDirExist(toPath)
  fs.cpSync(fromPath, toPath, { recursive: true })
}

export function getEverythingFrom<const T extends string>(somePath: T) {
  return fs.readdirSync(somePath, { recursive: true }) as string[]
}

export function ensureDirExist<const T extends string>(path: T) {
  fs.mkdirSync(path, { recursive: true })
}