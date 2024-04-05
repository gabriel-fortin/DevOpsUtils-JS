"use client"

import { FC, ReactNode, useEffect, useState } from "react"

import { useDevOpsGet } from "@/repository/devOps"
import { WorkItemDto } from "@/repository/WorkItemDto"


export const FetchWorkItem: FC<{
  url: string
  children?: (wi: WorkItemDto) => ReactNode
}> = ({
  url,
  children: consumer,
}) => {
    const [workItemDto, setWorkItemDto] = useState<WorkItemDto | null>(null)
    const devOpsRequest = useDevOpsGet(url)

    useEffect(() => {
      function getWorkItem() {
        fetch(devOpsRequest)
          .then(res => res.json())
          .then(data => {
            setWorkItemDto(data)
          })
          .catch(_ => setWorkItemDto(null))
      }
      getWorkItem()
    }, [devOpsRequest])

    return (workItemDto && consumer && consumer(workItemDto))
  }
