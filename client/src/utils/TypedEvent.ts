export interface Listener<T> {
    (event: T): void
}

export interface Disposable {
    dispose(): void
}

export interface ObserveOnlyTypedEvent<T> {
    on(listener: Listener<T>): Disposable
    once(listener: Listener<T>): Disposable
    off(listener: Listener<T>): boolean
    pipe(te: TypedEvent<T>): Disposable
}

/** passes through events as they happen. You will not get events from before you start listening */
export class TypedEvent<T = void> {
    private listeners: Listener<T>[] = []
    private listenersOncer: Listener<T>[] = []

    on = (listener: Listener<T>): Disposable => {
        this.listeners.push(listener)
        return {
            dispose: () => this.off(listener),
        }
    }

    once = (listener: Listener<T>): Disposable => {
        this.listenersOncer.push(listener)
        return {
            dispose: () => this.off(listener),
        }
    }

    off = (listener: Listener<T>): boolean => {
        let callbackIndex = this.listeners.indexOf(listener)

        if (callbackIndex > -1) {
            this.listeners.splice(callbackIndex, 1)
            return true
        }

        callbackIndex = this.listenersOncer.indexOf(listener)

        if (callbackIndex > -1) {
            this.listenersOncer.splice(callbackIndex, 1)
            return true
        }

        return false
    }

    emit = (event: T) => {
        this.listeners.forEach((listener) => listener(event))

        if (this.listenersOncer.length > 0) {
            const toCall = this.listenersOncer
            this.listenersOncer = []
            toCall.forEach((listener) => listener(event))
        }
    }

    pipe = (te: TypedEvent<T>): Disposable => {
        return this.on((e) => te.emit(e))
    }
}

export function observeOnly<T>(event: TypedEvent<T>): ObserveOnlyTypedEvent<T> {
    return event
}
