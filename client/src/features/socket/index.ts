import { io } from "socket.io-client"

const socket = io(window.location.origin, {
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
