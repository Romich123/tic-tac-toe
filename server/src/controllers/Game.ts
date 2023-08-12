import { TicTacToeField, IGame, User, Move } from "../types"
import { Result, error, success } from "../utils/Result"
import { TypedEvent } from "../utils/TypedEvent"

function createField(): TicTacToeField {
    return [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
    ]
}

export default class Game implements IGame {
    id: number
    started: boolean
    players: User[]
    currentState: TicTacToeField
    movesMade: number

    startEvent: TypedEvent
    playerJoinedEvent: TypedEvent<User>
    moveEvent: TypedEvent<TicTacToeField>
    playerLeftEvent: TypedEvent
    endEvent: TypedEvent<0 | 1 | -1>

    constructor(id: number) {
        this.id = id
        this.started = false
        this.players = []
        this.currentState = createField()
        this.movesMade = 0
        this.startEvent = new TypedEvent()
        this.endEvent = new TypedEvent<0 | 1 | -1>()
        this.playerJoinedEvent = new TypedEvent<User>()
        this.playerLeftEvent = new TypedEvent()
        this.moveEvent = new TypedEvent<TicTacToeField>()
    }

    makeMove(move: Move, user: User): Result<TicTacToeField, string> {
        if (!this.started) {
            return error("gameNotStarted")
        }

        if (user.currentGameId !== this.id) {
            return error("notInGame")
        }

        if (this.players[0].id !== user.id && this.players[1].id !== user.id) {
            return error("internalError")
        }

        if (this.currentState[move.y][move.x] !== " ") {
            return error("invalidMove")
        }

        const isCross = this.players[0].id === user.id
        const crossMoves = this.movesMade % 2 === 0

        if (isCross !== crossMoves) {
            return error("notYourTurn")
        }

        this.currentState[move.y][move.x] = isCross ? "X" : "O"

        this.movesMade++

        this.moveEvent.emit(this.currentState)

        const status = this.getStatus()

        if (!status) {
            return success(this.currentState)
        }

        this.end(status === "Draw" ? -1 : isCross ? 0 : 1)

        return success(this.currentState)
    }

    addPlayer(user: User): Result<boolean, string> {
        if (this.players.length === 2) {
            return error("gameIsFull")
        }

        this.players.push(user)

        if (this.players.length === 2) {
            this.start()
            return success(true)
        }

        this.playerJoinedEvent.emit(user)

        return success(false)
    }

    removePlayer(user: User): Result<boolean, string> {
        if (this.players.length === 0) {
            return error("gameIsEmpty")
        }

        if (this.players[0].id !== user.id && this.players[1].id !== user.id) {
            return error("internalError")
        }

        const leavingIndex = this.players.findIndex((p) => p.id === user.id)

        if (this.players.length === 2) {
            this.end((1 - leavingIndex) as 0 | 1)
            this.players.splice(leavingIndex, 1)

            this.playerLeftEvent.emit()

            return success(false)
        }

        this.players.splice(leavingIndex, 1)

        this.playerLeftEvent.emit()

        return success(true)
    }

    start() {
        this.started = true
        this.startEvent.emit()
    }

    end(winner: 0 | 1 | -1) {
        this.endEvent.emit(winner)
    }

    getStatus(): "X" | "O" | "Draw" | null {
        if (this.isWon("X")) {
            return "X"
        }

        if (this.isWon("O")) {
            return "O"
        }

        if (this.movesMade === 9) {
            return "Draw"
        }

        return null
    }

    isWon(player: "X" | "O"): boolean {
        const field = this.currentState

        for (let i = 0; i < 3; i++) {
            if (field[i][0] === player && field[i][1] === player && field[i][2] === player) {
                return true
            }

            if (field[0][i] === player && field[1][i] === player && field[2][i] === player) {
                return true
            }
        }

        if (field[0][0] === player && field[1][1] === player && field[2][2] === player) {
            return true
        }

        if (field[0][2] === player && field[1][1] === player && field[2][0] === player) {
            return true
        }

        return false
    }
}
