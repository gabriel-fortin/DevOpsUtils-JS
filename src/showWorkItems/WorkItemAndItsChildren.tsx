"use client"

import React from "react"

import { DisplayWorkItem } from "./DisplayWorkItem"
import { useFetchWorkItem } from "./hooks"
import { getChildrenIds, getParentId } from "./WorkItemDto"
import { useWorkItemIdValue } from "@/contexts/WorkItemIdContext"


export const WorkItemAndItsChildren: React.FC =
  (
  ) => {
    const workItemId = useWorkItemIdValue()
    if (workItemId == null) return
    return WorkItemAndItsChildrenInternal({ workItemId })
  }

const WorkItemAndItsChildrenInternal: React.FC<{
  workItemId: number
}> = ({
  workItemId,
}) => {
    const { workItemDto } = useFetchWorkItem(workItemId)
    const parentWorkItemId = getParentId(workItemDto)
    const childrenWorkItemsIds = getChildrenIds(workItemDto)

    /*  arrows   ↓↯↧⇓⇣⇩▼▽    ↘⇘   ⇒⇨⇾  */

    const overallStyle = {
      color: "grey",
    }
    const listItem = {
      display: "list-item",
      margin: "0.5em 0 0.5em 1.4em",
      listStyleType: "'⇘ '",
      fontSize: "1.2rem",
    }
    const parentingSymbol = {
      margin: "0.0em 0.0em 0.3em",
      fontSize: "1.2rem",
    }
    const mainItem = {
      color: "white",
    }

    return (
      <div style={overallStyle}>
        {parentWorkItemId &&
          <>
            <DisplayWorkItem workItemId={parentWorkItemId} />
            <div style={parentingSymbol}>
              ⇓
            </div>
          </>
        }
        <DisplayWorkItem workItemId={workItemId} style={mainItem} />
        {childrenWorkItemsIds
          .map(id =>
            <div style={listItem} key={id}>
              <DisplayWorkItem workItemId={id} />
            </div>
          )}
      </div>
    )
  }
