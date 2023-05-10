export type DeepReadonly<T> = T extends object
    ? {
          readonly [key in keyof T]: DeepReadonly<T[key]>
      }
    : Readonly<T>
