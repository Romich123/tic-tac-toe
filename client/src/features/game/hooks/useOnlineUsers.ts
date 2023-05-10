import { useEffect, useState } from "react"
import { TypedEvent } from "../../../../../server/src/utils/TypedEvent"
import socket from "../../socket"

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
