import z, { type util } from "zod";

export function unionOf<T extends util.Literal>(...something: T[]) {
  // return something.map(it => z.literal(it))
  return z.union(something.map(it => z.literal(it)))
}

export function nonEmptyString() {
  return z.string().nonempty()
}