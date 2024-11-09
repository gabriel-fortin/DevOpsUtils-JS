"use client"

import React, { FC, useEffect, useState } from "react"

import { useWorkItemIdSetter, useWorkItemIdValue } from "@/contexts/WorkItemIdContext"
import { usePersonalAccessTokenValue } from "@/contexts/PersonalAccessTokenContext"
import { useProjectUrl } from "@/selectProjectUrl"


export const SelectWorkItem: FC =
  () => {
    // internal things
    const [userValue, setUserValue] = useState<number | null>(null)
    const [isFirstInteraction, setIsFirstInteraction] = useState(true)

    // external things
    const setWorkItemId = useWorkItemIdSetter()
    const workItemId = useWorkItemIdValue()
    const { projectUrl } = useProjectUrl()
    const pat = usePersonalAccessTokenValue()

    useEffect(() => {
      setIsFirstInteraction(x => x && !workItemId)
    }, [workItemId])

    function confirmWorkItemChoice() {
      setWorkItemId(userValue)
    }

    function enteredValueChanged(event: React.ChangeEvent<HTMLInputElement>) {
      const userInput = Number(event.target.value)
      setUserValue(userInput ? userInput : null)
    }

    function keyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key == "Enter") {
        confirmWorkItemChoice()
      }
    }

    const selectingIsProbablyWhatUserNeedsToDo = projectUrl && pat && !workItemId && userValue
    let buttonStateClass: string = "hidden"
    if (userValue || !isFirstInteraction) buttonStateClass = "btn-secondary"
    if (userValue === workItemId) buttonStateClass += " btn-outline"
    if (selectingIsProbablyWhatUserNeedsToDo) buttonStateClass = "btn-accent"

    return (
      <div className="flex flex-col gap-3 min-w-80">
        <h2 className="ml-1 text-xl">
          Select a work item
        </h2>
        <div className="input input-bordered w-40 flex items-center pr-0">
          <input className="grow min-w-0"
            placeholder="work item id"
            onChange={enteredValueChanged}
            onKeyDown={keyDown}
          />
          <button className={`btn ${buttonStateClass}`}
            onClick={confirmWorkItemChoice}
          >
            Select
          </button>
        </div>
      </div>
    )
  }