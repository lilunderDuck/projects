import { dplLogger } from "./logging"

export function panic(something: string): Error {
  dplLogger.error("ERROR DURING PROJECT LOADING")
  dplLogger.error(something)
  return new Error(something)
}