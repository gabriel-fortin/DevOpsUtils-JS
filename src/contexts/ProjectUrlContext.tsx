"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

import { PROJECT_URL } from "@/config"


type UrlType = string
type UrlSetterType = (projectUrl: UrlType) => void

type ContextType = {
  value: UrlType
  setter: UrlSetterType
}
const defaultContextValue: ContextType = {
  value: "<no URL set>",
  setter: (_: UrlType) => { console.warn("Dummy setter was used") },
}

const ProjectUrlContext = createContext<ContextType>(defaultContextValue)

export function useProjectUrl(): [UrlType, UrlSetterType] {
  const { value, setter } = useContext(ProjectUrlContext)
  if (value === defaultContextValue.value) {
    console.debug("⚠️ Using project URL context before any value was set")
  }
  return [value, setter]
}

export const ProjectUrlContextProvider: React.FC<{
  children: React.ReactNode,
}> = ({
  children,
}) => {
    const [projectUrl, setProjectUrl] = useState<UrlType>(defaultContextValue.value)

    const memoedContextData = useMemo(() => ({
      value: projectUrl,
      setter: sanitized(setProjectUrl),
    }), [projectUrl])

    return (
      <ProjectUrlContext.Provider value={memoedContextData}>
        {children}
      </ProjectUrlContext.Provider>
    )
  }

// Prevent common errors when setting project's URL
function sanitized(setValue: UrlSetterType): UrlSetterType {
  return inputValue => {
    if (!URL.canParse(inputValue)) {
      console.error(`Project Url Context - setting URL failed because URL not valid: '${inputValue}'`)
      return
    }

    // remove trailing '/' because other parts of the code expect that
    const trimmedValue = inputValue.endsWith("/")
      ? inputValue.slice(0, -1)
      : inputValue

    setValue(trimmedValue)
  }
}

// Sets the context value once to a constant string
export const SetConstantProjectUrl: React.FC<{}> = ({ }) => {
  const [_, setProjectUrl] = useProjectUrl()

  useEffect(() => {
    setProjectUrl(PROJECT_URL)
  }, [setProjectUrl])

  return null
}
