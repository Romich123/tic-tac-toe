import { useEffect, useState } from "react"
import socket from "../../socket"
import { TypedEvent } from "../../../utils/TypedEvent"

const userCount = {
    current: 0,
}

const countChanged = new TypedEvent<number>()

socket.on("onlineUsers", countChanged.emit)

countChanged.on((count) => {
    userCount.current = count
})

export default function useOnlineUsers() {
    const [count, setCount] = useState(userCount.current)

    useEffect(() => {
        return countChanged.on(setCount).dispose
    }, [])

    return count
}
