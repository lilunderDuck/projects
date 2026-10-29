export const F_RESET = '\x1b[0m'
export const F_BOLD = '\x1b[1m'
export const F_DIM = '\x1b[2m'
export const F_ITALIC = '\x1b[3m'
export const F_UNDERSCORE = '\x1b[4m'
export const F_BLINK = '\x1b[5m'
export const F_REVERSE = '\x1b[7m'
export const F_HIDDEN = '\x1b[8m'

export const FG_BLACK = '\x1b[30m'
export const FG_RED = '\x1b[31m'
export const FG_GREEN = '\x1b[32m'
export const FG_YELLOW = '\x1b[33m'
export const FG_BLUE = '\x1b[34m'
export const FG_MAGENTA = '\x1b[35m'
export const FG_CYAN = '\x1b[36m'
export const FG_WHITE = '\x1b[37m'
export const FG_LIGHT_GRAY = '\x1b[37m'
export const FG_DARK_GRAY = '\x1b[90m'

export const BG_BLACK = '\x1b[40m'
export const BG_RED = '\x1b[41m'
export const BG_GREEN = '\x1b[42m'
export const BG_YELLOW = '\x1b[43m'
export const BG_BLUE = '\x1b[44m'
export const BG_MAGENTA = '\x1b[45m'
export const BG_CYAN = '\x1b[46m'
export const BG_WHITE = '\x1b[47m'

export function format(
  text: string, 
  format: string | null = F_RESET, 
  textColor: string | null = FG_WHITE, 
  backgroundColor: string | null = ''
) {
  if (format === null && textColor === null && backgroundColor === null) {
    return text
  }

  const thisTextFormat = [format ?? F_RESET, textColor ?? FG_WHITE, backgroundColor ?? ''].join('')
  return `${thisTextFormat}${text}${F_RESET}`
}

const LOG_TYPE_REGISTRY = {
  'info ': FG_CYAN,
  'warn ': FG_YELLOW,
  'error': FG_RED,
  'fatal': FG_RED,
}

function formatLog(label: string, logType: keyof typeof LOG_TYPE_REGISTRY) {
  return `${F_BOLD}${FG_LIGHT_GRAY}${label}${F_RESET} | ${F_BOLD}${LOG_TYPE_REGISTRY[logType]}${logType}${F_RESET}` as const
}

export function formatPath(pathOrUrl: string) {
  return format(pathOrUrl, F_BOLD, FG_BLUE, null)
}

export class NotLog4j {
  constructor(protected readonly LOG_LABEL: string) {}

  public info(...message: any) {
    console.log(formatLog(this.LOG_LABEL, 'info '), ...message)
  }

  public warn(...message: any) {
    console.log(formatLog(this.LOG_LABEL, 'warn '), ...message)
  }

  public error(...message: any) {
    console.log(formatLog(this.LOG_LABEL, 'error'), ...message)
  }

  public fatal(...message: any) {
    console.log(formatLog(this.LOG_LABEL, 'fatal'), ...message)
    process.exit(1)
  }
}

export const dplLogger = new NotLog4j("DPL")