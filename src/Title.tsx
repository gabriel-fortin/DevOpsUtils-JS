"use client"

import React, { useEffect, useMemo, useState } from "react"

import { BASE_URL, API_VERSION } from "@/constants"
import { usePersonalAccessToken } from "@/auth/PersonalAccessTokenHolder"


export const Title: React.FC<{
  id: number
}> = ({ id }) => {
  const [workItemData, setWorkItemData] = useState<WorkItem | null>(null)
  const devOpsRequest = useDevOpsGet(`${BASE_URL}/${id}?$expand=Relations`)

  function getWorkItem() {
    fetch(devOpsRequest)
      .then(res => res.json())
      .then(data => {
        setWorkItemData(data)
      })
      .catch(_ => setWorkItemData(null))
  }

  return (
    <>
      <div>
        <button onClick={getWorkItem}>TEST</button> <br />
        {workItemData && WorkItemDetails(workItemData)}
      </div>
    </>
  )
}

function WorkItemDetails(workItemData: WorkItem) {
  return (
    <>
      US: &nbsp;
      {workItemData?.fields["System.Title"]} <br />
      children: <br />
      {workItemData.relations
        ?.filter(x => x.rel === "System.LinkTypes.Hierarchy-Forward")
        .map(x => <Child key={x.url} url={x.url} />)}
    </>
  )
}

const Child: React.FC<{ url: string }> = ({ url }) => {
  const [workItemData, setWorkItemData] = useState<WorkItem | null>(null)
  const devOpsRequest = useDevOpsGet(url)

  useEffect(() => {
    fetch(devOpsRequest)
      .then(res => res.json())
      .then(setWorkItemData)
  }, [devOpsRequest, url])

  return (
    workItemData &&
    <>
      – &nbsp;
      {workItemData?.fields["System.Title"]}
      <br />
    </>
  )
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



type WorkItem = {
  fields: {
    "System.Title": string,
  }
  relations?: [{
    rel: string,
    url: string,
    attributes: [any]
  }]
}