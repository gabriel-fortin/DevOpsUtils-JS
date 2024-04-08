"use client"

import React, { FC, ReactNode } from "react"

import { BASE_URL } from "@/constants"
import { useWorkItemDto } from "@/contexts/WorkItemDtoContext"
import { WorkItemUrlContext } from "@/contexts/WorkItemUrlContext"
import { WorkItemDto } from "@/repository/WorkItemDto"

import { DisplayWorkItem } from "./DisplayWorkItem"
import { FetchWorkItem } from "./FetchWorkItem"
import { useWorkItemId } from "@/contexts/WorkItemIdContext"


export const WorkItemAndItsChildren: React.FC<{}> = ({}) => {
    const id = useWorkItemId()
    const url = `${BASE_URL}/${id}?$expand=Relations`

    const exposeWorkItem = (wi: WorkItemDto | null) => {
      // TODO: expose the work item to the whole app
    }

    const listItem = {
      display: "list-item",
      margin: "0.4em 0 0.4em 1em",
    }

    return (
      <div>
        <FetchWorkItem url={url} onWorkItemReceived={exposeWorkItem}>
          <DisplayWorkItem />
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


