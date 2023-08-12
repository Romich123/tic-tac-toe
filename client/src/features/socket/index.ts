import { io } from "socket.io-client"

const socket = io(import.meta.env.BASE_URL, {
    autoConnect: true,
})

socket.connect()

export function onSocketConnected(action: () => void) {
    if (socket.connected) {
        action()
    } else {
        socket.once("connect", action)
    }
}

export default socket
