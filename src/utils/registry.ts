interface IRegistry<T extends Record<string, any>> {
  get<Key extends keyof T>(name: Key): T[Key]
  getOrElseThrow<Key extends keyof T>(name: Key): NonNullable<T[Key]>
  getOrElseDefault<Key extends keyof T>(name: Key, defaultValue: T[Key]): NonNullable<T[Key]>
}

export function createRegistry<T extends Record<string, any>>(reg: T): IRegistry<T> {
  return {
    get: (name) => reg[name],
    getOrElseThrow(name) {
      if (reg[name]) {
        return reg[name]
      }

      // @ts-ignore
      throw new Error(`"${name}" does not exist in the registry, did your registry have a missing "${name}"?`)
    },
    getOrElseDefault: (name, defaultValue) => reg[name] ?? defaultValue
  } as const
}