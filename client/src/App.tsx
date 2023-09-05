import { useRef, useState } from "react"
import useAuth from "./features/auth/hooks/useAuth"
import "./App.css"
import { Game } from "./components/Game"
import { useTranslatedLabel } from "./features/translations/hooks/useTranslatedLabel"
import useOnlineUsers from "./features/game/hooks/useOnlineUsers"
import { LanguageChange } from "./features/translations/components/LanguageChange"

function App() {
    const [connected, setConnected] = useState(false)

    const userCount = useOnlineUsers()

    const gameTitle = useTranslatedLabel("gameName")
    const players = useTranslatedLabel("players", userCount)
    const online = useTranslatedLabel("online")

    document.title = gameTitle

    return (
        <>
            <LanguageChange />
            <header>
                <h1 className="heading">{gameTitle}</h1>
                <span className="player-count">{`${userCount} ${players} ${online}`}</span>
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

    const nicknameLabel = useTranslatedLabel("nickname")
    const joinLabel = useTranslatedLabel("joinGame")

    return (
        <div className="auth">
            <input ref={inputRef} type="text" placeholder={nicknameLabel} />
            <button onClick={() => inputRef.current && auth(inputRef.current.value)}>{joinLabel}</button>
        </div>
    )
}

export default App
