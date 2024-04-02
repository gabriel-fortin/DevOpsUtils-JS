"use client"

import React, { ReactNode, useRef, useState } from "react"

import { BASE_URL, API_VERSION } from "@/constants"
import { PersonalAccessTokenContext } from "./usePersonalAccessToken"


export const PatAuth: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [pat, setPat] = useState("")
  const [state, setState] = useState<"EMPTY" | "FETCHING" | "YES" | "NOPE">("EMPTY")
  const currentRequestAbortController = useRef<AbortController | null>(null)

  const onPatInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newPat = e.target.value
    verifyPat(newPat)
    setPat(newPat)
  }

  async function verifyPat(pat: string) {
    if (pat === "") {
      setState("EMPTY")
      return
    }

    const url = `${BASE_URL}?ids=${5296}&${API_VERSION}`
    const auth = `Basic ${btoa(":" + pat)}`
    const request = new Request(url)
    request.headers.append("Authorization", auth)
    request.headers.append("Accept", "application/json")

    setState("FETCHING")

    const abortController = new AbortController()
    currentRequestAbortController.current = abortController

    const response = await fetch(request, { signal: abortController.signal })

    if (response.status !== 200) setState("NOPE")
    else setState("YES")
  }

  return (
    <PersonalAccessTokenContext.Provider value={pat}>
      <h2>Authentication / authorisation</h2>
      <div>
        PAT: <input onChange={onPatInputChange} />
        <button onClick={() => verifyPat(pat)}>Auth!</button>
      </div>
      {state === "EMPTY" && "Enter Personal Access Token"}
      {state === "FETCHING" && "Checking the PAT"}
      {state === "NOPE" && "PAT check failure. It might be incorrect, not have the required access or there was a network problem"}
      {state === "YES" && children}
    </PersonalAccessTokenContext.Provider>
  )
}
