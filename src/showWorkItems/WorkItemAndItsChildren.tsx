"use client"

import React, { FC, ReactNode } from "react"

import { BASE_URL } from "@/constants"
import { useWorkItemDto } from "@/contexts/WorkItemDtoContext"
import { WorkItemUrlContext } from "@/contexts/WorkItemUrlContext"
import { WorkItemDto } from "@/repository/WorkItemDto"

import { DisplayWorkItem } from "./DisplayWorkItem"
import { FetchWorkItem } from "./FetchWorkItem"
import { useWorkItemId } from "@/contexts/WorkItemIdContext"


export const WorkItemAndItsChildren: React.FC<{}> =
  ({ }) => {
    const id = useWorkItemId()
    const url = `${BASE_URL}/wit/workitems/${id}?$expand=Relations`

    const exposeWorkItem = (wi: WorkItemDto | null) => {
      // TODO: expose the work item to the whole app
    }

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
        <FetchWorkItem url={url} onWorkItemReceived={exposeWorkItem}>
          <ForParentWorkItemUrl>
            <FetchWorkItem>
              <DisplayWorkItem />
            </FetchWorkItem>
            <div style={parentingSymbol}>
              ⇓
            </div>
          </ForParentWorkItemUrl>
          <DisplayWorkItem style={mainItem} />
          <ForEachChildWorkItemUrl>
            <FetchWorkItem>
              <div style={listItem}>
                <DisplayWorkItem />
              </div>
            </FetchWorkItem>
          </ForEachChildWorkItemUrl>
        </FetchWorkItem>
      </div>
    )
  }


// TODO: add prop for when there are no children
// TODO: add prop for when children info is not present on the wi?
const ForEachChildWorkItemUrl: FC<{ children: ReactNode }> = ({ children }) => {
  const wi = useWorkItemDto()
  if (!wi) return null

  return wi.relations
    ?.filter(x => x.rel === "System.LinkTypes.Hierarchy-Forward")
    .map(x => x.url)
    .map(url =>
      <WorkItemUrlContext.Provider key={url} value={url}>
        {children}
      </WorkItemUrlContext.Provider>
    )
}

const ForParentWorkItemUrl: FC<{ children: ReactNode }> = ({ children }) => {
  const wi = useWorkItemDto()
  const parentUrl = wi?.relations
    ?.find(x => x.rel === "System.LinkTypes.Hierarchy-Reverse")
    ?.url

  if (!wi || !parentUrl) return null

  return (
    <WorkItemUrlContext.Provider value={parentUrl}>
      {children}
    </WorkItemUrlContext.Provider>
  )
}
