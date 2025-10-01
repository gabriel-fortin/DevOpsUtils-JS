import { useContext } from "react"

import { defaultContextValue, ProjectUrlContext } from "./ProjectUrlContext"
import { UrlSetterType, UrlType } from "./types"


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

export function useOrgUrl(): UrlType {
  let { projectUrl } = useProjectUrl()

  if (!projectUrl) return null

  projectUrl = projectUrl?.endsWith("/") ? projectUrl.slice(0, -1) : projectUrl
  const orgUrl = projectUrl.substring(0, projectUrl.lastIndexOf("/"))

  return orgUrl
}
