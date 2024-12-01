"use client"

import { FC } from "react"

import { useWorkItemCall } from "@/dataAccess/workItem"


export const DisplayWorkItem: FC<{
  workItemId: number
}> = ({
  workItemId,
}) => {
    const { workItemDto: wi } = useWorkItemCall(workItemId)
    if (!wi) return null

    const wiTypeUrl = wi._links?.workItemType.href
    const wiType = decodeURI(wiTypeUrl?.substring(wiTypeUrl.lastIndexOf("/") + 1) || "???")

    const metainfo = `[${wiType} #${wi.id}]`
    const title = wi.fields["System.Title"]

    return (
      <div>
        <div className="text-xs underline underline-offset-4">
          {metainfo}
        </div>
        <div>
          {title}
        </div>
      </div>
    )
  }
