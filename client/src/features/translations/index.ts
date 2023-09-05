import { FixedLengthArray } from "../../utils/FixedlLengthArray"
import { TypedEvent, observeOnly } from "../../utils/TypedEvent"
import { Language, allTranslations } from "./allTranslation"

export type TranslationPhrases = "gameName" | "online" | "nickname" | "joinGame" | "findGame" | "yourTurn" | "enemyTurn" | "youWon" | "youLost" | "draw"
export type TranslationPluralPhrases = "players"

type Phrases = {
    readonly [p in TranslationPhrases]: string
}

type PluralPhrases<PluralCount extends number> = {
    pluralCount: PluralCount
    getPluralId(count: number): number
} & {
    readonly [pp in TranslationPluralPhrases]: FixedLengthArray<string, PluralCount>
}

export type Translation<PluralCount extends number> = Readonly<PluralPhrases<PluralCount> & Phrases & { id: string }>

let currentTranslation: Translation<number> = allTranslations.en

const translationChange = new TypedEvent<Translation<number>>()

export const translationChangeEvent = observeOnly(translationChange)

export function changeLanguage(lang: Language) {
    currentTranslation = allTranslations[lang]

    translationChange.emit(currentTranslation)
}

export function translate(tp: TranslationPhrases): string
export function translate(tp: TranslationPluralPhrases, count: number): string
export function translate(tp: TranslationPhrases | TranslationPluralPhrases, count?: number): string {
    if (count || count === 0) {
        tp = tp as TranslationPluralPhrases

        const plurals = currentTranslation[tp]

        return plurals[currentTranslation.getPluralId(count)]
    }

    return currentTranslation[tp as TranslationPhrases]
}
