"use client"

import { createContext, useContext } from "react"

type ContextData = {
  workItemId: number | null
  setWorkItemId: (x: number | null) => void
}
const defaultData: ContextData = {
  workItemId: null,
  setWorkItemId: () => { },
}

export const WorkItemIdContext = createContext<ContextData>(defaultData)

export function useWorkItemId() {
  return useContext(WorkItemIdContext)
}
