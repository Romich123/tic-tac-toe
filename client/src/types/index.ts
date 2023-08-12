import { Socket } from "socket.io-client"
import { z } from "zod"

export const inputUserSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export type InputUser = z.infer<typeof inputUserSchema>

export type User = { id: number; name: string; currentGameId?: number; socket?: Socket }

export type TicTacToeCell = "X" | "O" | " "

export type TicTacToeField = [[TicTacToeCell, TicTacToeCell, TicTacToeCell], [TicTacToeCell, TicTacToeCell, TicTacToeCell], [TicTacToeCell, TicTacToeCell, TicTacToeCell]]

export const moveSchema = z.object({
    x: z.number().min(0).max(2),
    y: z.number().min(0).max(2),
})

export type Move = z.infer<typeof moveSchema>

export type IGame = {
    id: number
    started: boolean
    players: User[]
    currentState: TicTacToeField
    movesMade: number
}
