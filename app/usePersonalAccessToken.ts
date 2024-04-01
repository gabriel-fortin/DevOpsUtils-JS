import { createContext, useContext } from "react"

export const PersonalAccessTokenContext = createContext("")

export function usePersonalAccessToken() {
    return useContext(PersonalAccessTokenContext)
}
