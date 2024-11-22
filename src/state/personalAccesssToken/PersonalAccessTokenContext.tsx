import React, { ReactElement, createContext, useContext, useState } from "react"


type ValueType = string
type ContextType = {
  patValue: ValueType
  patSetter: (_newPat: ValueType) => void
}

const defaultValue: ContextType = {
  patValue: "",
  patSetter: _ => console.warn("PAT setter not initialised, new value not set")
}
const PersonalAccessTokenContext = createContext<ContextType>(defaultValue)

export function usePersonalAccessToken(): ContextType {
  return useContext(PersonalAccessTokenContext)
}

export const PersonalAccessTokenContextProvider: React.FC<{
  children: ReactElement,
}> = ({
  children,
}) => {
    const [pat, setPat] = useState<string>("")

    const context: ContextType = {
      patValue: pat,
      patSetter: setPat,
    }

    return (
      <PersonalAccessTokenContext.Provider value={context}>
        {children}
      </PersonalAccessTokenContext.Provider>
    )
  }
