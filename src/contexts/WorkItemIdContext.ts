"use client"

import { createContext, useContext } from "react"


export const WorkItemIdContext = createContext<number | null>(null)

export function useWorkItemId() {
  return useContext(WorkItemIdContext)
}
