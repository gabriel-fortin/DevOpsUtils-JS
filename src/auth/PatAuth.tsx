"use client"

import React, { useEffect, useState } from "react"

import { useAnyCallUsingPat } from "./hooks"
import { usePatStorage } from "./patStorage"


export const PatAuth: React.FC<{
  onPatChange: (_: string) => void
}> = ({
  onPatChange: notifyPatChanged
}) => {
    const [currentPat, setCurrentPat] = useState("")
    const [state, setState] = useState<"EMPTY" | "FETCHING" | "YES" | "NOPE">("EMPTY")
    const [isAutoLoad, setIsAutoLoad] = useState(true)
    const [patInStorage, savePatToStorage] = usePatStorage()
    const { data: response, isLoading } = useAnyCallUsingPat(currentPat)

    useEffect(() => {
      if (isLoading) {
        setState("FETCHING")
      } else if (!currentPat) {
        setState("EMPTY")
      } else if (response?.status === 200) {
        notifyPatChanged(currentPat)
        setState("YES")
      } else {
        notifyPatChanged("")
        setState("NOPE")
      }
    }, [isLoading, notifyPatChanged, currentPat, response])

    useEffect(() => {
      if (isAutoLoad) {
        setCurrentPat(patInStorage)
      }
    }, [isAutoLoad, patInStorage])

    const onPatInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const newPat = e.target.value
      setCurrentPat(newPat)
    }

    const loadPat = () => {
      setCurrentPat(patInStorage)
    }
    const savePat = () => {
      // don't save a PAT that didn't lead to a successful response
      if (state !== "YES") return

      savePatToStorage(currentPat)
    }

    const toggleAutoLoad = () => {
      setIsAutoLoad(!isAutoLoad)
    }

    const spaced = { margin: "0.5em 0", display: "flex", gap: "0.5em" }
    const save = { visibility: currentPat ? "initial" : "hidden" as React.CSSProperties["visibility"] }
    const load = { visibility: patInStorage ? "initial" : "hidden" as React.CSSProperties["visibility"] }

    return (
      <>
        <h2>Authentication / authorisation</h2>
        <div style={spaced}>
          <input checked={isAutoLoad} onChange={toggleAutoLoad} id="patAutoLoad" type="checkbox"></input>
          <label htmlFor="patAutoLoad">
            Load PAT automatically (if previously saved)
          </label>
        </div>
        <div style={spaced}>
          <div style={{ alignSelf: "center" }}>PAT: </div>
          <input value={currentPat} onChange={onPatInputChange} />
          <button onClick={savePat} style={save}>Save to local storage</button>
        </div>
        <div style={spaced}>
          <button onClick={loadPat} style={load}>Load from local storage</button>
        </div>
        {state === "EMPTY" && "👆 Enter Personal Access Token"}
        {state === "FETCHING" && "❔ Checking the PAT"}
        {state === "NOPE" && "❌ PAT check failure. It might be incorrect for the current project, not have the required access or there was a network problem"}
        {state === "YES" && "✔️ PAT successfully checked"}
      </>
    )
  }
