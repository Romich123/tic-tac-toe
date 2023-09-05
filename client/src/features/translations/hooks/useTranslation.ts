import { useEffect, useState } from "react"
import { changeLanguage, translationChangeEvent } from ".."
import { Language, languagesArray } from "../allTranslation"

export function useTranslation() {
    const [currentLanguage, setCurrentLanguage] = useState<Language>("en")

    useEffect(() => {
        translationChangeEvent.on((val) => setCurrentLanguage(val.id as Language))
    }, [])

    return [currentLanguage, languagesArray, changeLanguage] as const
}
