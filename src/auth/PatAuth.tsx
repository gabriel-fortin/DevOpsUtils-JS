"use client"

import React, { useEffect, useState } from "react"

import { useAnyCallUsingPat } from "./hooks"
import { usePatStorage } from "./patStorage"
import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"


export const PatAuth: React.FC<{
  requiresAttention: boolean
}> = ({
  requiresAttention,
}) => {
    // internal things
    const [currentPatInput, setCurrentPatInput] = useState("")
    const [state, setState] = useState<"EMPTY" | "FETCHING" | "YES" | "NOPE">("EMPTY")
    const [isAutoLoad, setIsAutoLoad] = useState(true)

    // external things
    const [patInStorage, savePatToStorage] = usePatStorage()
    const { patSetter: sendPatToTheRestOfTheApp } = usePersonalAccessToken()
    const { data: response, isLoading } = useAnyCallUsingPat(currentPatInput)

    useEffect(() => {
      if (isLoading) {
        setState("FETCHING")
      } else if (!currentPatInput) {
        setState("EMPTY")
      } else if (response?.status === 200) {
        sendPatToTheRestOfTheApp(currentPatInput)
        setState("YES")
      } else { // Pat entered but its validation failed
        sendPatToTheRestOfTheApp("")
        setState("NOPE")
      }
    }, [isLoading, sendPatToTheRestOfTheApp, currentPatInput, response])

    useEffect(() => {
      if (isAutoLoad) {
        setCurrentPatInput(patInStorage)
        if (!patInStorage) {
          sendPatToTheRestOfTheApp("")
        }
      }
    }, [isAutoLoad, patInStorage, sendPatToTheRestOfTheApp])

    const onPatInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const newPat = e.target.value
      setCurrentPatInput(newPat)
    }

    const loadPat = () => {
      setCurrentPatInput(patInStorage)
    }
    const savePat = () => {
      // don't save a PAT that didn't lead to a successful response
      if (state !== "YES") return

      savePatToStorage(currentPatInput)
    }

    const toggleAutoLoad = () => {
      setIsAutoLoad(!isAutoLoad)
    }

    // badge used for info in the PAT input field
    const [bagdeText, bagdeClass] = {
      "EMPTY": ["not entered yet", "badge-primary-content"],
      "FETCHING": ["checking", "badge-info animate-bounce"],
      "NOPE": ["failure", "badge-error"],
      "YES": ["confirmed", "badge-success badge-outline border"],
    }[state]

    const isHighlight = requiresAttention && !currentPatInput

    return (
      <div className="flex flex-col gap-3">

        <h2 className="ml-1 text-xl">
          Authentication / authorisation
        </h2>

        {/* PAT entry input field */}
        <div className="flex gap-2 items-center">
          <label className={`w-[28em] flex gap-3 items-center justify-self-center input ${isHighlight && "input-accent"}`}>
            <span className={`pr-3 ${isHighlight && "border-r-2 border-accent" || "border-r"}`}>
              PAT
            </span>
            <input value={currentPatInput} onChange={onPatInputChange}
              placeholder="Personal Access Token"
              className="grow text-ellipsis min-w-14"
            />
            <span className={`ml-4 -mr-1 px-2 py-0.5 text-sm rounded bagde ${bagdeClass}`}>
              {bagdeText}
            </span>
          </label>
        </div>

        {/* checkbox for auto-loading PAT */}
        <div className="flex gap-2">
          <input checked={isAutoLoad} onChange={toggleAutoLoad} id="patAutoLoad" type="checkbox"
            className="checkbox checkbox-primary"
          />
          <label htmlFor="patAutoLoad">
            Load PAT automatically (if previously saved)
          </label>
        </div>

        {/* buttons for loading/saving PAT */}
        <div className="flex gap-2">
          <button onClick={savePat} title="Save to local storage"
            className={`btn btn-xs pb-5 ${!currentPatInput && "invisible"}`}
          >
            Save to local storage
          </button>
          <button className={`btn btn-xs ${isHighlight && "btn-accent btn-outline"} pb-5 ${!patInStorage && "invisible"}`}
            onClick={loadPat}
            title="Load from local storage"
          >
            Load from local storage
          </button>
        </div>

        {/* PAT status line */}
        <div className="self-center mt-2">
          {state === "EMPTY" && "👆 Enter Personal Access Token"}
          {state === "FETCHING" && "❔ Checking the PAT"}
          {state === "NOPE" && "❌ PAT check failure. It might be incorrect for the current project, not have the required access or there was a network problem"}
          {state === "YES" && "✔️ PAT successfully checked"}
        </div>

      </div>
    )
  }
