"use client"

import { FC, ReactNode, useCallback, useEffect, useState } from "react"

import { WorkItemDtoContext } from "@/contexts/WorkItemDtoContext"
import { useWorkItemUrl } from "@/contexts/WorkItemUrlContext"
import { useDevOpsGet } from "@/repository/devOps"
import { WorkItemDto } from "@/repository/WorkItemDto"


/**
 * Fetches a work item from the given URL and
 * exposes the received work item data via a {@link WorkItemDtoContext}
 */
export const FetchWorkItem: FC<{
  url?: string
  onWorkItemReceived?: (wi: WorkItemDto | null) => void
  children?: ReactNode
}> = ({
  url: propUrl,
  onWorkItemReceived,
  children,
}) => {
    const [workItemDto, setWorkItemDto] = useState<WorkItemDto | null>(null)
    const contextUrl = useWorkItemUrl()
    const devOpsRequest = useDevOpsGet(propUrl ?? contextUrl ?? "UNDEFINED URL")

    const onWorkItemDtoChange = useCallback((wi: WorkItemDto | null) => {
      setWorkItemDto(wi)
      if (onWorkItemReceived) onWorkItemReceived(wi)
    }, [onWorkItemReceived])

    useEffect(() => {
      fetch(devOpsRequest)
        .then(res => res.json())
        .then(data => {
          onWorkItemDtoChange(data)
        })
        .catch(_ => onWorkItemDtoChange(null))
    }, [devOpsRequest, onWorkItemDtoChange])

    return (
      <WorkItemDtoContext.Provider value={workItemDto}>
        {children}
      </WorkItemDtoContext.Provider>
    )
  }
