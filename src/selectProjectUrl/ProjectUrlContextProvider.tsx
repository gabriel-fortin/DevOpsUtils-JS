"use client"

import { useMemo, useState } from "react"

import { defaultContextValue, ProjectUrlContext } from "./context"
import { UrlSetterType, UrlType } from "./types"


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
    if (!inputValue){
      setValue("")
      return
    }

    if (!URL.canParse(inputValue)) {
      console.warn(`Project Url Context - setting invalid URL: '${inputValue}'`)
      setValue("")
      return
    }

    // remove trailing '/' because other parts of the code expect that
    const trimmedValue = inputValue.endsWith("/")
      ? inputValue.slice(0, -1)
      : inputValue

    setValue(trimmedValue)
  }
}
