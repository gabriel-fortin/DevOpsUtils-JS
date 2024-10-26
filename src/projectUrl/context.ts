import { createContext } from "react"

import { ContextType } from "./types"


export const defaultContextValue: ContextType = {
  value: "",
  setter: () => { console.warn("Dummy setter was used") },
}

export const ProjectUrlContext = createContext<ContextType>(defaultContextValue)
