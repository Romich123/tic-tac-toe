import socket from ".."
import { TypedEvent } from "../../../../../server/src/utils/TypedEvent"

export default function useSocket() {
    const errorEvent = new TypedEvent<string>()

    socket.on("error", (error) => {
        console.error(error)
        errorEvent.emit(error)
    })

    return { socket, errorEvent }
}
