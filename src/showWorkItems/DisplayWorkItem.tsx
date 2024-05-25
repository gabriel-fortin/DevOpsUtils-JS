"use client"

import React, { FC } from "react"

import { useFetchWorkItem } from "./hooks"


export const DisplayWorkItem: FC<{
  workItemId: number
  style?: React.CSSProperties
}> = ({
  workItemId,
  style: injectedStyle,
}) => {
    const { workItemDto: wi } = useFetchWorkItem(workItemId)
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
      <div style={{ ...defaultStyle, ...injectedStyle }}>
        <div style={emph}>[{wiType} #{wi.id}]</div>
        <div>{wi.fields["System.Title"]}</div>
      </div>
    )
  }
