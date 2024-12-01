"use client"

import { useCallback } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"


type PatStore = {
    [url: string]: string
}

export const usePatStorage: (_projectUrl: string | null) => [string, (_: string) => void] =
    (projectUrl) => {
        const [dataInStorage, saveDataToStorage] = useLocalStorage<PatStore>("pat", {})

        const hasInvalidOrg = !projectUrl || projectUrl.lastIndexOf("/") < 0

        // make a guess on the part of the URL representing the organisation
        const orgUrl = hasInvalidOrg ? undefined : projectUrl.slice(0, projectUrl.lastIndexOf("/"))

        // assume that all projects in an organisation use the same PAT
        const pat: string =
            hasInvalidOrg
                ? ""
                : dataInStorage[orgUrl ?? "return an undefined"] ?? ""

        const setPat = useCallback((newPat: string) => {
            if (orgUrl === undefined) return
            const newData = {
                ...dataInStorage,
                // assume that all projects in an organisation use the same PAT
                [orgUrl]: newPat
            }
            saveDataToStorage(newData)
        }, [dataInStorage, saveDataToStorage, orgUrl])

        return [pat, setPat]
    }