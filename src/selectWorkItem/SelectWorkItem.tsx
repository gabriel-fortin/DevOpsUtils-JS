"use client"

import React, { FC, useEffect, useState } from "react"

import { useWorkItemId } from "@/contexts/WorkItemIdContext"


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

    return (
      <div className="flex flex-col gap-3 min-w-80">
        <h2 className="ml-1 text-xl">
          Select a work item
        </h2>
        <div className="input input-bordered w-40 flex items-center pr-0">
          <input className="grow min-w-0"
            placeholder="id"
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