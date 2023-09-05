import { useEffect, useState } from "react"
import { changeLanguage, getCurrentTranslation, translationChangeEvent } from ".."
import { Language, languagesArray } from "../allTranslation"

export function useTranslation() {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(getCurrentTranslation().id as Language)

    useEffect(() => {
        translationChangeEvent.on((val) => setCurrentLanguage(val.id as Language))
    }, [])

    return [currentLanguage, languagesArray, changeLanguage] as const
}
