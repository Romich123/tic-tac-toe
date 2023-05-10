import { Move, TicTacToeField, User, inputUserSchema, moveSchema } from "../types"
import { io } from "../index"
import { db } from "../db"
import Game from "./Game"
import { Socket } from "socket.io"
import JWT from "jsonwebtoken"

function gameIdToRoom(gameId: number) {
    return `game-${gameId}`
}

function serializeGame(game: Game) {
    return { id: game.id, started: game.started, currentState: game.currentState, movesMade: game.movesMade, players: game.players.map((user) => ({ id: user.id, name: user.name })) }
}

function serializePlayer(user: User) {
    return { id: user.id, name: user.name }
}

function createGame(): Game {
    const game = db.game.create()

    const room = io.to(gameIdToRoom(game.id))

    game.startEvent.once(() => {
        db.game.removeWaiting(game.id)
        room.emit("gameUpdated", serializeGame(game))
    })

    game.endEvent.once((winner) => {
        for (let i of game.players) {
            i.currentGameId = undefined
        }

        if (winner === -1) {
            room.emit("gameEnded", "draw")
        } else {
            const winnerPlayer = game.players[winner]

            if (!winnerPlayer) {
                room.emit("gameEnded", "draw")
            } else {
                room.emit("gameEnded", serializePlayer(winnerPlayer))
            }
        }

        for (let i of game.players) {
            if (i) {
                i.socket?.leave(gameIdToRoom(game.id))
            }
        }

        db.game.delete(game.id)
    })

    game.moveEvent.on((field) => {
        room.emit("gameUpdated", serializeGame(game))
    })

    return game
}

const onlineUsers: {
    [key: number]: User
} = {}

setInterval(() => {
    io.emit("onlineUsers", Object.values(onlineUsers).length)
}, 200)

export default (socket: Socket) => {
    socket.emit("onlineUsers", Object.values(onlineUsers).length)

    socket.on("startAuth", (jwt) => {
        if (typeof jwt !== "string") {
            socket.emit("error", "invalidToken")
            return
        }

        let userId: number

        try {
            const authUser = JWT.verify(jwt.toString(), process.env.SECRET)

            const result = inputUserSchema.parse(authUser)

            const user: User = {
                ...result,
                socket: socket,
            }

            userId = result.id

            onlineUsers[userId] = user
        } catch {
            socket.emit("error", "invalidToken")
            return
        }

        if (typeof userId === "undefined") {
            socket.emit("error", "invalidToken")
            return
        }

        function getUser() {
            return onlineUsers[userId]
        }

        socket.emit("onlineUsers", Object.values(onlineUsers).length)
        socket.emit("successfulAuth")

        socket.on("findGame", () => {
            const user = getUser()

            const games = db.game.findMany()

            if (user.currentGameId && games[user.currentGameId]) {
                socket.emit("error", "alreadyInGame")
                return
            }

            const gamesWaiting = db.game.findManyWaiting()

            let game = gamesWaiting[0]

            if (!game) {
                game = createGame()
            }

            game.addPlayer(user)

            user.currentGameId = game.id

            socket.join(gameIdToRoom(game.id))

            socket.emit("foundGame", serializeGame(game))
        })

        socket.on("makeMove", (move) => {
            const user = getUser()

            const result = moveSchema.safeParse(move)

            if (!result.success) {
                socket.emit("error", "invalidMove")
                return
            }

            if (!user.currentGameId) {
                socket.emit("error", "notInGame")
                return
            }

            const moveResult = db.game.findById(user.currentGameId).makeMove(result.data, getUser())

            if (!moveResult.success) {
                socket.emit("error", moveResult.error)
                return
            }
        })

        socket.on("disconnect", () => {
            const user = getUser()

            if (user.currentGameId) {
                const game = db.game.findById(user.currentGameId)

                if (game) {
                    game.removePlayer(user)
                }

                if (game.players.length === 0) {
                    db.game.delete(game.id)
                }
            }

            delete onlineUsers[user.id]
        })
    })
}
