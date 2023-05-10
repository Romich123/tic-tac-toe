import { io } from "socket.io-client"

const socket = io("localhost:3000", {
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
