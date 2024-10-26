import { useContext } from "react"

import { UrlSetterType, UrlType } from "./types"
import { defaultContextValue, ProjectUrlContext } from "./context"


/** Returns a [URL, URL setter] pair: [string, string => void] */
export function useProjectUrl(): [UrlType, UrlSetterType] {
  const { value, setter } = useContext(ProjectUrlContext)
  if (value === defaultContextValue.value) {
    console.debug("⚠️ Using project URL context when no URL set")
  }
  return [value, setter]
}
