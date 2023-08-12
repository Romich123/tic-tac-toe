import { useRef, useState } from "react"
import useAuth from "./features/auth/hooks/useAuth"
import "./App.css"
import useOnlineUsers from "./features/game/hooks/useOnlineUsers"
import { Game } from "./components/Game"

function formatPlayers(playerCount: number) {
    return `${playerCount} player${playerCount === 1 ? "" : "s"} online`
}

function App() {
    const [connected, setConnected] = useState(false)

    const userCount = useOnlineUsers()

    return (
        <>
            <header>
                <h1 className="heading">Tic Tac Toe</h1>
                <span className="player-count">{formatPlayers(userCount)}</span>
            </header>
            {connected ? <Game /> : <Auth onSubmit={() => setConnected(true)} />}
        </>
    )
}

type AuthProps = {
    onSubmit: () => void
}

function Auth({ onSubmit }: AuthProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const { connect, queueAction } = useAuth()

    async function auth(name: string) {
        connect(name)
        queueAction(() => {
            onSubmit()
        })
    }

    return (
        <div className="auth">
            <input ref={inputRef} type="text" placeholder="Nickname" />
            <button onClick={() => inputRef.current && auth(inputRef.current.value)}>Join</button>
        </div>
    )
}

export default App
