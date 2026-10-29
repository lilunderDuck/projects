import { dplLogger, F_BOLD, format } from "./logging"

export function panic(...something: any[]): Error {
  dplLogger.error(format("ERROR DURING PROJECT LOADING", F_BOLD))
  dplLogger.error(...something)
  return new Error(something.join(' '))
}