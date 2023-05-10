import { useEffect, useState } from "react"
import { TypedEvent, observeOnly } from "../../../../../server/src/utils/TypedEvent"
import socket, { onSocketConnected } from "../../socket"
import { trpc } from "../../../trpc"
import { InputUser } from "../../../../../server/src/types"
import jwtDecode from "jwt-decode"

const authed = {
    current: false,
}

const glUser = {
    current: null as InputUser | null,
}

function disconnectHandler() {
    authed.current = false
    glUser.current = null
}

export default function useAuth() {
    if (!socket.connected) {
        socket.connect()
        socket.on("disconnect", disconnectHandler)
    }

    useEffect(() => {
        return () => {
            socket.off("disconnect", disconnectHandler)
        }
    }, [])

    const successfulEvent = new TypedEvent()
    const newJwtEvent = new TypedEvent<string>()

    const [user, setUser] = useState(glUser.current)

    useEffect(() => {
        if (glUser.current) {
            setUser(glUser.current)
        }
    }, [])

    function connect(name: string) {
        onSocketConnected(() => {
            trpc.userCreate.mutate({ name }).then((jwt) => {
                glUser.current = jwtDecode(jwt)
                newJwtEvent.emit(jwt)

                socket.once("successfulAuth", () => {
                    successfulEvent.emit()
                    authed.current = true
                })

                socket.emit("startAuth", jwt)
            })
        })
    }

    function queueAction(action: () => void) {
        if (authed.current) {
            action()
        } else {
            successfulEvent.once(action)
        }
    }

    return { connect, user, successfulEvent: observeOnly(successfulEvent), newJwtEvent: observeOnly(newJwtEvent), queueAction }
}
