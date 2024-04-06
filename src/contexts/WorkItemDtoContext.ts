"use client"

import { createContext, useContext } from "react"

import { WorkItemDto } from "@/repository/WorkItemDto"


export const WorkItemDtoContext = createContext<WorkItemDto | null>(null)

export function useWorkItemDto() {
  return useContext(WorkItemDtoContext)
}
