"use client"

import React, { useRef, useState } from "react"

import { BASE_URL } from "@/constants"
import { useLocalStorage } from "@uidotdev/usehooks"
import { useDevOpsGet } from "@/repository/devOps"


export const PatAuth: React.FC<{
  onPatChange: (_: string) => void
}> = ({ onPatChange }) => {
  const [pat, setPat] = useState("")
  const [state, setState] = useState<"EMPTY" | "FETCHING" | "YES" | "NOPE">("EMPTY")
  const requestAbortion = useRef<AbortController | null>(null)
  const [patInStorage, savePatToStorage] = useLocalStorage("pat", "")
  const requestAnything: Request = useDevOpsGet(`${BASE_URL}/wit/tags`, pat)

  const onPatInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newPat = e.target.value
    verifyPat(newPat)
    setPat(newPat)
    onPatChange("")
  }

  const loadPat = () => {
    return setPat(patInStorage)
  }
  const savePat = () => {
    return savePatToStorage(pat)
  }

  async function verifyPat(pat: string) {
    requestAbortion.current?.abort()

    if (pat === "") {
      setState("EMPTY")
      return
    }

    setState("FETCHING")

    const controller = new AbortController()
    requestAbortion.current = controller

    const response = await fetch(requestAnything, { signal: controller.signal })

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
        PAT: <input value={pat} onChange={onPatInputChange} />
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
