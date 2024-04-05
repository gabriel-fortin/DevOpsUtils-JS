"use client"

import React, { FC, ReactNode, useEffect, useMemo, useState } from "react"

import { BASE_URL, API_VERSION } from "@/constants"
import { usePersonalAccessToken } from "@/auth/PersonalAccessTokenHolder"


export const Title: React.FC<{
  id: number
}> = ({ id }) => {
  const url = `${BASE_URL}/${id}?$expand=Relations`

  const listItem = {
    display: "list-item",
    margin: "0.4em 0 0.4em 1em",
  }

  return (
    <div>
      <FetchWorkItem url={url}>
        {wi =>
          <DisplayWorkItem wi={wi}>
            {childUrl =>
              <div style={listItem}>
                <FetchWorkItem url={childUrl}>
                  {childWi => <DisplayWorkItem wi={childWi} />}
                </FetchWorkItem>
              </div>
            }
          </DisplayWorkItem>
        }
      </FetchWorkItem>
    </div>
  )
}

const DisplayWorkItem: FC<{
  wi: WorkItemDto,
  children?: (url: string) => ReactNode,
}> = ({ wi, children: renderChild }) => {
  const wiTypeUrl = wi._links?.workItemType.href
  const wiType = decodeURI(wiTypeUrl?.substring(wiTypeUrl.lastIndexOf("/") + 1) || "???")
  const childrenWorkItemUrls = wi.relations?.filter(x => x.rel === "System.LinkTypes.Hierarchy-Forward").map(x => x.url) || []

  const emph = { fontStyle: "italic", textDecoration: "underline" }

  return (
    <div>
      <div style={emph}>{wiType} #{wi.id}</div>
      <div>{wi.fields["System.Title"]}</div>
      <div>
        {renderChild && childrenWorkItemUrls.map(renderChild)}
      </div>
    </div>
  )
}

const FetchWorkItem: FC<{
  url: string,
  children?: (wi: WorkItemDto) => ReactNode
}> = ({ url, children: consumer }) => {
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




function useDevOpsGet(url: string): Request {
  const pat = usePersonalAccessToken()

  return useMemo<Request>(() => {
    const joinChar = url.includes("?") ? "&" : "?"
    const request = new Request(`${url}${joinChar}${API_VERSION}`)

    const auth = `Basic ${btoa(":" + pat)}`
    request.headers.append("Authorization", auth)

    request.headers.append("Accept", "application/json")
    return request
  }, [url, pat])
}



type WorkItemDto = {
  id: string
  rev: number
  url: string
  fields: {
    "System.Title": string,
  }
  relations?: [{
    rel: string,
    url: string,
    attributes: [any]
  }]
  _links?: {
    self: { href: string }
    workItemType: { href: string }
  }
}