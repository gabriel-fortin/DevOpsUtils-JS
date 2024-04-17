"use client"

import React, { CSSProperties, FC, useCallback, useEffect, useState } from "react"

import { SelectableTask, createFreshTasksList } from "./tasks"
import { useWorkItemId } from "@/contexts/WorkItemIdContext"


export function AddTasks() {
  const [tasks, setTasks] = useState<SelectableTask[]>(createFreshTasksList)
  const wiId = useWorkItemId()

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
    // TODO: call DevOps, add tasks to WI
    resetTaskSelection()
  }

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
      {tasks.map(x =>
        <RenderItem key={x.name} task={x} onToggle={toggleTask} />
      )}
      <button onClick={addSelectedTasksToWorkItem} style={buttonStyle}>
        Add above tasks to #{wiId}
      </button>
    </details>
  )
}

export const RenderItem: FC<{
  task: SelectableTask,
  onToggle: (t: SelectableTask) => void,
}> = ({
  task,
  onToggle: toggle,
}) => {
    const labelStyle: CSSProperties = { display: "block" }
    const checkboxStyle: CSSProperties = { margin: "0.1em 0.5em 0.2em 0" }

    return (
      <label style={labelStyle}>
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
