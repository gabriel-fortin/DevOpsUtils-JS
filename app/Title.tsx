"use client"

import React, { useState } from "react"

import { BASE_URL, API_VERSION } from "./constants"
import { usePersonalAccessToken } from "./usePersonalAccessToken"


export const Title: React.FC<{
  id: number
}> = ({ id }) => {
  const [wiTitle, setWiTitle] = useState("")
  const pat = usePersonalAccessToken()

  function getWorkItem() {
    const url = `${BASE_URL}?ids=${id}&${API_VERSION}`
    const auth = `Basic ${btoa(":" + pat)}`

    const request = new Request(url)
    request.headers.append("Authorization", auth)
    console.log("auth", auth)

    request.headers.append("Accept", "application/json")

    fetch(request)
      .then(res => res.json())
      .then(data => {
        return setWiTitle(data.value[0].fields["System.Title"])
      })
  }

  return (
    <>
      <div>
        <button onClick={getWorkItem}>TEST</button> <br />
        work item title: <br />
        {wiTitle}
      </div>
    </>
  )
}
