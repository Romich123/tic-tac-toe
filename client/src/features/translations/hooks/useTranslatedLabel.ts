import { useEffect, useState } from "react"
import { TranslationPhrases, TranslationPluralPhrases, translate, translationChangeEvent } from ".."

export function useTranslatedLabel(id: TranslationPhrases): string
export function useTranslatedLabel(id: TranslationPluralPhrases, count: number): string
export function useTranslatedLabel(id: TranslationPhrases | TranslationPluralPhrases, count?: number) {
    const [result, setResult] = useState<string>(translate(id as TranslationPluralPhrases, count as number))

    useEffect(() => {
        translationChangeEvent.on(() => {
            setResult(translate(id as TranslationPluralPhrases, count as number))
        })
    }, [])

    useEffect(() => {
        setResult(translate(id as TranslationPluralPhrases, count as number))
    }, [count])

    return result
}
