import { useEffect, useState } from "react"
import { TicTacToeCell, TicTacToeField } from "../../../../server/src/types"
import useGame from "../../features/game/hooks/useGame"
import styles from "./game.module.css"

const toSvg: {
    [key in TicTacToeCell]: React.ReactNode
} = {
    X: (
        <svg className={styles.cross} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg>
    ),
    O: (
        <svg className={styles.circle} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        </svg>
    ),
    " ": <span></span>,
}

const emptyField: TicTacToeField = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
]

export function Game() {
    const { findGame: findNewGame, game, user, gameEndedEvent, makeMove } = useGame()

    const [gameResult, setGameResult] = useState("")

    useEffect(() => {
        const disposable = gameEndedEvent.once((result) => {
            if (result === "draw") {
                setGameResult("Draw!")
            } else {
                setGameResult(`You ${result.id === user?.id ? "won!" : "lost!"}`)
            }
        })

        return disposable.dispose
    })

    function findGame() {
        setGameResult("")
        findNewGame()
    }

    const field = game?.currentState ?? emptyField

    const userIndex = user?.id === game?.players[0].id ? 0 : 1

    const userTeam = !game ? "?" : userIndex === 0 ? "X" : "O"
    const enemyTeam = !game?.players[0] ? "" : userIndex === 0 ? "O" : "X"
    const enemy = !game?.players[0] ? null : game?.players[1 - userIndex] || { name: "?" }

    const currentMove = game?.started ? game?.movesMade : undefined

    const ourMove = currentMove !== undefined && currentMove % 2 === userIndex

    const gameEnded = !!gameResult

    const text = gameResult || (game?.started ? `${ourMove ? "Your" : "Enemy"} turn` : "")
    const textClassName = gameResult ? styles["game-ended"] : `${styles.turn} ${game ? (ourMove ? styles["user"] : styles["enemy"]) : ""}`

    return (
        <>
            <div className={styles.players}>
                <div className={styles.player}>
                    <span className="name">{user?.name}</span>
                    <span>-</span>
                    <span className="team">{userTeam}</span>
                </div>
                <div className={`${styles.player} ${!game ? styles.empty : ""} ${styles.enemy}`}>
                    <span className="team">{enemyTeam}</span>
                    <span>-</span>
                    <span className="name">{enemy?.name}</span>
                </div>
            </div>

            <div className={`${styles.field} ${currentMove !== undefined ? ((currentMove - (gameEnded ? 1 : 0)) % 2 === userIndex ? styles["user-move"] : styles["enemy-move"]) : ""}`}>
                <div className={styles.background}></div>
                <div className={styles.text}>
                    <span className={textClassName}>{text}</span>
                </div>
                {field.map((row, i) =>
                    row.map((cell, j) => (
                        <div key={`${i}-${j}`} className={`${styles.cell} ${cell === " " ? "" : "filled"}`} onClick={() => makeMove(j, i)}>
                            {toSvg[cell]}
                        </div>
                    ))
                )}
            </div>
            {!game || gameEnded ? (
                <button className={styles["find-game-button"]} onClick={findGame}>
                    Find Game
                </button>
            ) : null}
        </>
    )
}
