export type Result<T, E> =
    | {
          success: true
          value: T
      }
    | {
          success: false
          error: E
      }

export function success<T>(value: T): Result<T, never> {
    return { success: true, value }
}

export function error<E>(error: E): Result<never, E> {
    return { success: false, error }
}

export function map<T, E>(result: Result<T, E>, successFn: (value: T) => T, errFn: (error: E) => E) {
    if (result.success) {
        successFn(result.value)
    } else {
        errFn(result.error)
    }
}
