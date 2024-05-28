"use client"

import { createContext, useContext } from "react"

type ContextData = {
  workItemId: number | null
}
const defaultData: ContextData = {
  workItemId: null,
}

export const WorkItemIdContext = createContext<ContextData>(defaultData)

export function useWorkItemId() {
  return useContext(WorkItemIdContext)
}
