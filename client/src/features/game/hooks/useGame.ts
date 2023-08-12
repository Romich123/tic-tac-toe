import { useEffect, useState } from "react"
import useAuth from "../../auth/hooks/useAuth"
import socket from "../../socket"
import { IGame, InputUser } from "../../../types"
import { TypedEvent, observeOnly } from "../../../utils/TypedEvent"

const glGame = {
    current: null as IGame | null,
}

const gameChangeEvent = new TypedEvent<IGame | null>()
const gameEndedEvent = new TypedEvent<"draw" | InputUser>()

function gameUpdateHandler(game: IGame) {
    glGame.current = game
    gameChangeEvent.emit(game)
}

function gameEndHandler(result: "draw" | InputUser): void {
    console.log("Game ended", result)

    gameEndedEvent.emit(result)
}

socket.on("gameUpdated", gameUpdateHandler)
socket.on("gameEnded", gameEndHandler)

export default function useGame() {
    const [game, setGame] = useState<IGame | null>()

    useEffect(() => {
        if (glGame.current) {
            setGame(glGame.current)
        }

        const disposable = gameChangeEvent.on(setGame)

        return () => {
            disposable.dispose()
        }
    }, [])

    const gameFoundEvent = new TypedEvent<IGame>()

    const { queueAction, ...authProps } = useAuth()

    function findGame() {
        glGame.current = null
        setGame(null)

        queueAction(() => {
            socket.emit("findGame")
            socket.on("foundGame", (game) => {
                glGame.current = game
                setGame(game)
                gameFoundEvent.emit(game)
            })
        })
    }

    function makeMove(x: number, y: number) {
        socket.emit("makeMove", { x, y })
    }

    return { findGame, makeMove, game, gameEndedEvent: observeOnly(gameEndedEvent), gameFoundEvent: observeOnly(gameFoundEvent), ...authProps }
}
