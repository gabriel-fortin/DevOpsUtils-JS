"use client"

import React, { useRef, useState } from "react"

import { BASE_URL, API_VERSION } from "@/constants"
import { useLocalStorage } from "@uidotdev/usehooks"


export const PatAuth: React.FC<{
  onPatChange: (_: string) => void
}> = ({ onPatChange }) => {
  const [pat, setPat] = useState("")
  const [state, setState] = useState<"EMPTY" | "FETCHING" | "YES" | "NOPE">("EMPTY")
  const currentRequestAbortController = useRef<AbortController | null>(null)
  const [patInStorage, savePatToStorage] = useLocalStorage("pat", "")

  const onPatInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newPat = e.target.value
    verifyPat(newPat)
    setPat(newPat)
    onPatChange("")
  }

  const loadPat = () => {
    console.log("🚀 ~ loadPat ~ loadPat:", loadPat)
    return setPat(patInStorage)
  }
  const savePat = () => {
    console.log("🚀 ~ savePat ~ savePat:", savePat)
    return savePatToStorage(pat)
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
    else {
      setState("YES")
      onPatChange(pat)
    }
  }

  const spaced = { margin: "0.5em 0", display: "flex", gap: "0.5em" }
  const save = { visibility: pat ? "initial" : "hidden" as React.CSSProperties["visibility"] }
  const load = { visibility: patInStorage ? "initial" : "hidden" as React.CSSProperties["visibility"] }

  return (
    <>
      <h2>Authentication / authorisation</h2>
      <div style={spaced}>
        PAT: <input onChange={onPatInputChange} />
        <button onClick={savePat} style={save}>Save to local storage</button>
      </div>
      <div style={spaced}>
        <button onClick={loadPat} style={load}>Load from local storage</button>
        <button onClick={() => verifyPat(pat)}>Auth!</button>
      </div>
      {state === "EMPTY" && "👆 Enter Personal Access Token"}
      {state === "FETCHING" && "❔ Checking the PAT"}
      {state === "NOPE" && "❌ PAT check failure. It might be incorrect, not have the required access or there was a network problem"}
      {state === "YES" && "✔️ PAT successfully checked"}
    </>
  )
}
