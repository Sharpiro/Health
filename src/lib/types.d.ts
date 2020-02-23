/** gets common properties from 2 types */
export type Common<A, B> = { [P in keyof A & keyof B]: A[P] | B[P] }

/** exclude methods from a type.  getters/setters not supported */
export type ExcludeMethods<T> = Pick<T, { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]>
