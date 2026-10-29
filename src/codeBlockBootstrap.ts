import { dplLogger } from "./utils"
import { createHighlighter } from 'shiki'

dplLogger.info("Loading bootstrap resources - loading predefined langs for code highlighting...")
export const highlighter = await createHighlighter({
  themes: ["catppuccin-frappe"],
  langs: ["typescript", "javascript", "gdscript"],
})