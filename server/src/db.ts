import Game from "./controllers/Game"
import { User } from "./types"
import { DeepReadonly } from "./utils/DeepReadonly"
import jwt from "jsonwebtoken"

const gamesWaiting: Game[] = []
const games: { [key: number]: Game } = {}

let gamesIdOffset = 1
let userIdOffset = 1

export const db = {
    user: {
        create: (data: { name: string }) => {
            const user: User = { id: userIdOffset++, ...data }

            return jwt.sign(user, process.env.SECRET)
        },
    },
    game: {
        findById: (id: number) => games[id],
        findMany: () => Object.values(games),
        create: () => {
            const game = (games[gamesIdOffset] = new Game(gamesIdOffset++))
            gamesWaiting.push(game)
            return game
        },
        findManyWaiting: () => gamesWaiting,
        removeWaiting: (gameId: number) => {
            const index = gamesWaiting.findIndex((game) => game.id === gameId)

            if (index !== -1) {
                gamesWaiting.splice(index, 1)
            }
        },
        delete: (gameId: number) => {
            const index = gamesWaiting.findIndex((game) => game.id === gameId)

            if (index !== -1) {
                gamesWaiting.splice(index, 1)
            }

            delete games[gameId]
        },
    },
}
