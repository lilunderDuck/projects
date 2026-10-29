const predefinedLabels = {
  debug: "#525eff",
  version: "#ff6a8d",
  "state transition": "#ff6ddf",
  "shouting out loud": "#c890ff"
}

export const LOG_BASE_STYLE = "color: #11111b; padding-inline: 5px; border-radius: 6px; font-weight: bold"
export const DUCK_LOG_LABEL = `${LOG_BASE_STYLE};background-color: #ebb748`

export function duckDotLog(...something: any[]) {
  console.log(`%cduck%c`, DUCK_LOG_LABEL, "", ...something)
}

export function logWithLabel(label: keyof typeof predefinedLabels, ...something: any[]) {
  console.log(
    `%cduck%c %c${label}%c`, 
    DUCK_LOG_LABEL, "",
    `${LOG_BASE_STYLE};background-color: ${predefinedLabels[label]}`, "", 
    ...something
  )
}

export function logStateTransition(state: string, ...something: any[]) {
  console.log(
    `%cduck%c %cstate transition%c %c${state}%c`, 
    DUCK_LOG_LABEL, "",
    `${LOG_BASE_STYLE};background-color:#ff6ddf`, "",
    "color: #cba6f7;font-weight:bold", "",
    ...something
  )
}

export function logVersion(appName: string, stackUsed: string) {
  console.log(
    `%cduck%c %cversion%c %c${appName}%c, made with no contexts and %c${stackUsed}%c, love is really the 1st ingredient for this one!\n\nSource code can be found at: https://github.com/lilunderDuck/unnamed-spinning-cube/\n\nCredits for (all) 3D model has been used can be found right here.`, 
    DUCK_LOG_LABEL, "",
    `${LOG_BASE_STYLE};background-color:#ff6a8d`, "",
    "color: #63c3ff;font-weight:bold", "",
    "color: #4dffaf;font-weight:bold", "",
  )
}