"use client"

import React, { CSSProperties, FC, useCallback, useEffect, useState } from "react"

import { useWorkItemId } from "@/contexts/WorkItemIdContext"
import { useAddTasksToWorkItem } from "@/repository/swr"

import { SelectableTask, createFreshTasksList } from "./tasks"


export function AddTasks() {
  const [tasks, setTasks] = useState<SelectableTask[]>(createFreshTasksList)
  const { workItemId: wiId, setWorkItemId } = useWorkItemId()
  const { trigger } = useAddTasksToWorkItem(wiId, tasks.filter(x => x.isSelected))

  const resetTaskSelection = useCallback(() => setTasks(createFreshTasksList()), [])

  // clear tasks' selection on WI change
  useEffect(() => resetTaskSelection, [wiId, resetTaskSelection])

  const toggleTask = (toggledTask: SelectableTask) => {
    setTasks(tasks.map(t =>
      (t.name !== toggledTask.name)
        ? t
        : {
          ...t,
          isSelected: !t.isSelected,
        }
    ))
  }

  const addSelectedTasksToWorkItem = () => {
    console.log("🚀 ~ addSelectedTasksToWorkItem ")
    if (!wiId) return

    resetTaskSelection()

    trigger()

    // trigger a refresh
    setWorkItemId(null)
    setTimeout(() => {
      setWorkItemId(wiId)
    }, 10)
  }

  const specialTasks = tasks.filter(x => x.group === "special")
  const presentationLayerTasks = tasks.filter(x => x.group === "Presentation")
  const accessLayerTasks = tasks.filter(x => x.group === "Access")

  const summaryStyle: CSSProperties = { display: "block" }
  const headerStyle: CSSProperties = { display: "list-item" }
  const buttonStyle: CSSProperties = {
    marginTop: "1em",
    opacity: tasks.some(x => x.isSelected) ? "1" : "0.3",
  }

  return (
    <details>
      <summary style={summaryStyle}>
        <h2 style={headerStyle}>
          Add tasks
        </h2>
      </summary>
      <RenderTasks tasks={specialTasks} onToggle={toggleTask} />
      <Separator />
      <RenderTasks tasks={presentationLayerTasks} onToggle={toggleTask} />
      <Separator />
      <RenderTasks tasks={accessLayerTasks} onToggle={toggleTask} />
      <button onClick={addSelectedTasksToWorkItem} style={buttonStyle}>
        Add above tasks to #{wiId}
      </button>
    </details>
  )
}

const RenderTasks: FC<{
  tasks: SelectableTask[],
  onToggle: (t: SelectableTask) => void,
}> = ({
  tasks,
  onToggle: toggle,
}) => {
    const labelStyle: CSSProperties = { display: "block" }
    const checkboxStyle: CSSProperties = { margin: "0.2em 0.5em 0.3em 0" }

    return tasks.map(task =>
      <label style={labelStyle} key={task.name}>
        <input type="checkbox"
          value={task.name}
          checked={task.isSelected}
          onChange={() => toggle(task)}
          style={checkboxStyle}
        />
        {task.getTitle()}
      </label>
    )
  }

function Separator() {
  const separatorStyle: CSSProperties = { margin: "0.7em" }
  return (<div style={separatorStyle} />)
}
