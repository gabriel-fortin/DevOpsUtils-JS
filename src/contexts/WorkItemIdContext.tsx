"use client"

import { createContext, ReactNode, useContext, useState } from "react"

type ContextData = {
  workItemId: number | null
  setter: (workItemId: number | null) => void
}
const defaultData: ContextData = {
  workItemId: null,
  setter: _ => console.warn("Work Item Id setter not initiialised; new value not set")
}

const WorkItemIdContext = createContext<ContextData>(defaultData)

export function useWorkItemIdValue(): ContextData["workItemId"] {
  return useContext(WorkItemIdContext).workItemId
}

export function useWorkItemIdSetter(): ContextData["setter"] {
  return useContext(WorkItemIdContext).setter
}

export const WorkItemIdContextProvider: React.FC<{
  children: ReactNode
}> = ({
  children,
}) => {
    const [workItemId, setWorkItemId] = useState<ContextData["workItemId"]>(null)
    return (
      <WorkItemIdContext.Provider value={{ workItemId, setter: setWorkItemId }}>
        {children}
      </WorkItemIdContext.Provider>
    )
  }

export const IfWorkItemIdIsSet: React.FC<{
  children: ReactNode
}> = ({
  children,
}) => {
    const workItemId = useWorkItemIdValue()
    if (!workItemId) return null
    return children
  }
