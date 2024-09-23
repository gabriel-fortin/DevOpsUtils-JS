import React, { ReactElement, createContext, useContext, useState } from "react"


type ContextType = [string, (_: string) => void]
const defaultValue: ContextType = ["",
  (_: string) => console.warn("PAT setter no initialised, new value not set")]
const PersonalAccessTokenContext = createContext<ContextType>(defaultValue)

export function usePersonalAccessTokenValue(): string {
  const [pat] = useContext(PersonalAccessTokenContext)
  return pat
}

export function usePersonalAccessTokenSetter(): (_: string) => void {
  const [_, setPat] = useContext(PersonalAccessTokenContext)
  return setPat
}

export const PersonalAccessTokenContextProvider: React.FC<{
  children: ReactElement,
}> = ({
  children,
}) => {
    const [pat, setPat] = useState<string>("")

    return (
      <PersonalAccessTokenContext.Provider value={[pat, setPat]}>
        {children}
      </PersonalAccessTokenContext.Provider>
    )
  }
