"use client"

import { createContext, useContext } from "react"


export const WorkItemUrlContext = createContext<string | null>(null)

export function useWorkItemUrl() {
  return useContext(WorkItemUrlContext)
}
