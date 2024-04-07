"use client"

import { createContext, useContext } from "react"


const WorkItemIdContext = createContext<number | null>(null)

function useWorkItemId() {
  return useContext(WorkItemIdContext)
}
