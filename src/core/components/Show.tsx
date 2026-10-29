import type { ReactNode } from "react"

export function Show<T extends any>(props: { 
  when: T | null | undefined,
  fallback?: ReactNode
  children: ReactNode
}) {
  return props.when ? props.children : props.fallback
}