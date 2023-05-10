import { useState } from "react"
import { TicTacToeCell, TicTacToeField } from "../../../server/src/types"

export function useField() {
    const [field, setField] = useState<TicTacToeField>([
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
    ])

    function set(x: number, y: number, value: TicTacToeCell) {
        const newField = [...field] as TicTacToeField

        newField[x][y] = value

        setField(newField)
    }

    return { field, set }
}
