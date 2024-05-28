"use client"

import React, { useEffect, useState } from "react"

import { useLocalStorage } from "@uidotdev/usehooks"
import { useAnyCallUsingPat } from "./hooks"


export const PatAuth: React.FC<{
  onPatChange: (_: string) => void
}> = ({ onPatChange: notifyPatChanged }) => {
  const [pat, setPat] = useState("")
  const [state, setState] = useState<"EMPTY" | "FETCHING" | "YES" | "NOPE">("EMPTY")
  const [patInStorage, savePatToStorage] = useLocalStorage("pat", "")
  const { data: response, isLoading } = useAnyCallUsingPat(pat)

  useEffect(() => {
    if (isLoading) {
      setState("FETCHING")
    } else if (!pat) {
      setState("EMPTY")
    } else if (response?.status === 200) {
      notifyPatChanged(pat)
      setState("YES")
    } else {
      notifyPatChanged("")
      setState("NOPE")
    }
  }, [isLoading, notifyPatChanged, pat, response])

  const onPatInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newPat = e.target.value
    setPat(newPat)
  }

  const loadPat = () => {
    return setPat(patInStorage)
  }
  const savePat = () => {
    return savePatToStorage(pat)
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
        {/* <button onClick={() => verifyPat(pat)}>Auth!</button> */}
      </div>
      {state === "EMPTY" && "👆 Enter Personal Access Token"}
      {state === "FETCHING" && "❔ Checking the PAT"}
      {state === "NOPE" && "❌ PAT check failure. It might be incorrect, not have the required access or there was a network problem"}
      {state === "YES" && "✔️ PAT successfully checked"}
    </>
  )
}
