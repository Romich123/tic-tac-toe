import { Translation } from "."

export const allTranslations = {
    "en": {
        id: "en",
        pluralCount: 2,
        getPluralId(count) {
            return count !== 1 ? 1 : 0
        },
        players: ["player", "players"],
        gameName: "Tic Tac Toe",
        online: "online",
        nickname: "Nickname",
        joinGame: "Join",
        findGame: "Find Game",
        yourTurn: "Your turn",
        enemyTurn: "Enemy turn",
        youWon: "You won",
        youLost: "You lost",
        draw: "Draw",
    } as Translation<2>,
    "ru": {
        id: "ru",
        pluralCount: 3,
        getPluralId(count) {
            if (count % 10 === 1 && count % 100 !== 11) {
                return 0
            }

            if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
                return 1
            }

            return 2
        },
        players: ["игрок", "игрока", "игроков"],
        gameName: "Крестики-Нолики",
        online: "в сети",
        nickname: "Псевдоним",
        joinGame: "Присоединиться",
        findGame: "Найти игру",
        yourTurn: "Ваш ход",
        enemyTurn: "Ход врага",
        youWon: "Победа",
        youLost: "Поражение",
        draw: "Ничья",
    } as Translation<3>,
}

export const languagesArray = Object.keys(allTranslations) as (keyof typeof allTranslations)[]

export type Language = (typeof languagesArray)[1]
