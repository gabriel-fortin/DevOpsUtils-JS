"use client"

import React, { FC, useEffect, useState } from "react"

import { NotFoundError, useWorkItemCall } from "@/dataAccess/workItem"
import { useWorkItemId } from "@/state/workItemId"


export const SelectWorkItem: FC<{
  requiresAttention: boolean
}> = ({
  requiresAttention,
}) => {
    // internal things
    const [userValue, setUserValue] = useState<number | null>(null)
    const [isFirstInteraction, setIsFirstInteraction] = useState(true)

    // external things
    const { workItemId, setWorkItemId } = useWorkItemId()
    const { error: wiFetchError, isValidating } = useWorkItemCall(workItemId)

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

    let buttonStateClass: string = "hidden"
    if (userValue || !isFirstInteraction) buttonStateClass = "btn-secondary"
    if (userValue === workItemId) buttonStateClass += " btn-outline"
    if (requiresAttention && userValue) buttonStateClass = "btn-accent"
    const showNotFoundError = (userValue === workItemId) && wiFetchError instanceof NotFoundError
    const showOtherError = (userValue === workItemId) && wiFetchError && !showNotFoundError

    return (
      <div className="flex flex-col gap-3 min-w-80">
        <h2 className="ml-1 text-xl">
          Select a work item
        </h2>
        <div className="flex items-center">
          <div className="input input-bordered w-40 flex items-center pr-0">
            <input className="grow min-w-0"
              placeholder="id"
              onChange={enteredValueChanged}
              onKeyDown={keyDown}
            />
            <div className={`btn ${buttonStateClass}`}
              onClick={confirmWorkItemChoice}
            >
              Select
            </div>
          </div>
          {isValidating && <span className="loading mx-3"></span>}
          {showNotFoundError && <span className="ml-3 text-error">work item not found</span>}
          {showOtherError && <span className="ml-3 text-error">error fetching work item</span>}
        </div>
      </div>
    )
  }