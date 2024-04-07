"use client"

import React, { FC, useState } from "react"


export const SelectWorkItem: FC<{
  onWorkItemSelected: (id: number | null) => void,
}> = ({
  onWorkItemSelected: notifyWorkItemSelected,
}) => {
    const [userValue, setUserValue] = useState<number | null>(null)

    function confirmWorkItemChoice() {
      notifyWorkItemSelected(userValue)
    }

    function enteredValueChanged(event: React.ChangeEvent<HTMLInputElement>) {
      const userInput = Number(event.target.value)
      setUserValue(userInput ? userInput : null)
    }

    function keyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key == "Enter") confirmWorkItemChoice()
    }

    const buttonStyle = userValue
      ? {}
      : { opacity: "0.3" }
    const simpleFlex = { display: "flex", gap: "0.5em" }

    return (
      <>
        <h2>Id of work item</h2>
        <div style={simpleFlex}>
          <input onChange={enteredValueChanged} onKeyDown={keyDown} />
          <button onClick={confirmWorkItemChoice} style={buttonStyle}>Select</button>
        </div>
      </>
    )
  }