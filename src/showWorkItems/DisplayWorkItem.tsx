"use client"

import React, { FC } from "react"

import { useWorkItemDto } from "@/contexts/WorkItemDtoContext"


export const DisplayWorkItem: FC<{
  style?: React.CSSProperties
}> = ({
  style: injectedStyle
}) => {
    const wi = useWorkItemDto()
    if (!wi) return null

    const wiTypeUrl = wi._links?.workItemType.href
    const wiType = decodeURI(wiTypeUrl?.substring(wiTypeUrl.lastIndexOf("/") + 1) || "???")

    const emph = {
      textDecoration: "underline",
      fontSize: "0.7rem",
    }
    const defaultStyle = {
      fontSize: "1rem",
    }

    return (
      <div style={{...defaultStyle, ...injectedStyle}}>
        <div style={emph}>[{wiType} #{wi.id}]</div>
        <div>{wi.fields["System.Title"]}</div>
      </div>
    )
  }
