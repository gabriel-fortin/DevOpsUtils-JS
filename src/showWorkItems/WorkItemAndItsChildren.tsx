"use client"

import React from "react"

import { useFetchWorkItem } from "@/repository/swr"
import { WorkItemDto, extractWorkItemId } from "@/repository/WorkItemDto"

import { DisplayWorkItem } from "./DisplayWorkItem"


export const WorkItemAndItsChildren: React.FC<{
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

function getParentId(workItemDto?: WorkItemDto): number | null {
  const parentUrl = workItemDto
    ?.relations
    ?.find(x => x.rel === "System.LinkTypes.Hierarchy-Reverse")
    ?.url

  if (!parentUrl) return null
  return extractWorkItemId(parentUrl)
}

function getChildrenIds(workItemDto?: WorkItemDto): number[] {
  const maybeIds: (number | null)[] | undefined =
    workItemDto
      ?.relations
      ?.filter(x => x.rel === "System.LinkTypes.Hierarchy-Forward")
      .map(x => extractWorkItemId(x.url))
  return omitFalsyValues(maybeIds ?? [])
}

function omitFalsyValues<T>(arg: (T | null | undefined)[]): T[] {
  return arg.filter(x => !!x) as T[]
}
