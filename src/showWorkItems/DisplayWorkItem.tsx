"use client"

import React, { FC, ReactNode } from "react"

import { WorkItemDto } from "@/repository/WorkItemDto"


export const DisplayWorkItem: FC<{
  wi: WorkItemDto
  children?: (url: string) => ReactNode
}> = ({
  wi,
  children: renderChild,
}) => {
    const wiTypeUrl = wi._links?.workItemType.href
    const wiType = decodeURI(wiTypeUrl?.substring(wiTypeUrl.lastIndexOf("/") + 1) || "???")
    const childrenWorkItemUrls = wi.relations?.filter(x => x.rel === "System.LinkTypes.Hierarchy-Forward").map(x => x.url) || []

    const emph = {
      textDecoration: "underline",
      fontSize: "0.7em",
    }

    return (
      <div>
        <div style={emph}>[{wiType} #{wi.id}]</div>
        <div>{wi.fields["System.Title"]}</div>
        <div>
          {renderChild && childrenWorkItemUrls.map(renderChild)}
        </div>
      </div>
    )
  }
