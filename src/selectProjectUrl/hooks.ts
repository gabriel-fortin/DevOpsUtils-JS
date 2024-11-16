import { useContext } from "react"

import { UrlSetterType, UrlType } from "./types"
import { defaultContextValue, ProjectUrlContext } from "./context"


type HookReturnType = {
  projectUrl: UrlType
  setProjectUrl: UrlSetterType
  removeProjectUrl: () => void
}

export function useProjectUrl(): HookReturnType {
  const { value, setter } = useContext(ProjectUrlContext)

  if (value === defaultContextValue.value) {
    console.debug("⚠️ Using project URL context when no URL set")
  }

  return {
    projectUrl: value,
    setProjectUrl: setter,
    removeProjectUrl: () => setter(null),
  }
}
