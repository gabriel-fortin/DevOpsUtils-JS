"use client"

import React from "react"

import { getChildrenIds, getParentId, useWorkItemCall } from "@/dataAccess/workItem"
import { useWorkItemId } from "@/state/workItemId"

import { DisplayWorkItem } from "./DisplayWorkItem"


const itemTextColor = "text-primary-content/70"
const currentItemTextColor = "text-primary-content"

export const WorkItemAndItsChildren: React.FC =
  () => {
    const { workItemId } = useWorkItemId()
    if (workItemId == null) return

    return (
      <WorkItemAndItsChildrenInternal workItemId={workItemId} />
    )
  }

const WorkItemAndItsChildrenInternal: React.FC<{
  workItemId: number
}> = ({
  workItemId,
}) => {
    const { workItemDto } = useWorkItemCall(workItemId)
    const parentWorkItemId = getParentId(workItemDto)
    const childrenWorkItemsIds = getChildrenIds(workItemDto)

    /*  arrows   ↓↯↧⇓⇣⇩▼▽    ↘⇘   ⇒⇨⇾  */

    if (!workItemDto) {
      return (
        <span className="ml-3 text-error">no work item to show here</span>
      )
    }

    return (
      <div className={`mx-4 ${itemTextColor}`}>
        {parentWorkItemId && <ParentItem workItemId={parentWorkItemId} />}
        <CurrentItem workItemId={workItemId} />
        {childrenWorkItemsIds.map(id => <ChildItem workItemId={id} />)}
      </div>
    )
  }

const ParentItem: React.FC<{
  workItemId: number
}> = ({
  workItemId: parentWorkItemId,
}) => {
    return (
      <>
        <div className="-mx-0.5">
          <DisplayWorkItem workItemId={parentWorkItemId} />
        </div>
        <div className="mb-1 text-xl">
          ⇓
        </div>
      </>
    )
  }

const CurrentItem: React.FC<{
  workItemId: number
}> = ({
  workItemId,
}) => {
    const border = "border border-secondary rounded-lg"
    const spacing = "pl-3 pr-4 py-2 -mx-4"
    const shadow = "" //"shadow-md shadow-secondary/10"

    return (
      <div className={`w-fit ${border} ${spacing} ${shadow} ${currentItemTextColor}`}>
        <DisplayWorkItem workItemId={workItemId} />
      </div>
    )
  }

const ChildItem: React.FC<{
  workItemId: number
}> = ({
  workItemId: childWorkItemId,
}) => {
    return (
      <div className="list-item text-xl my-3 ml-4 pl-3 [list-style-type:'⇘']"
        key={childWorkItemId}
      >
        <div className="text-base">
          <DisplayWorkItem workItemId={childWorkItemId} />
        </div>
      </div>
    )
  }
