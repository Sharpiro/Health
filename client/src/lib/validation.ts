import { validateSync } from "class-validator"

export function* validateArray(data: any) {
  assertArray(data, 1)
  for (const item of data) {
    yield validateSync(item)
  }
}

export function assertArray(val: any, minSize: number): asserts val is Array<any> {
  if (!Array.isArray(val)) {
    throw new Error("array was undefined")
  }
  if (val.length < minSize) {
    throw new Error(`array length was '${minSize}'`)
  }
}
