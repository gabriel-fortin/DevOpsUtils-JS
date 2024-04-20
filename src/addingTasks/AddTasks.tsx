"use client"

import React, { CSSProperties, FC, useCallback, useEffect, useState } from "react"

import { BASE_URL } from "@/constants"
import { useWorkItemId } from "@/contexts/WorkItemIdContext"
import { useDevOpsPost } from "@/repository/devOps"

import { SelectableTask, createFreshTasksList } from "./tasks"


export function AddTasks() {
  const [tasks, setTasks] = useState<SelectableTask[]>(createFreshTasksList)
  const { workItemId: wiId, setWorkItemId } = useWorkItemId()
  const request = useDevOpsPost(`${BASE_URL}/wit/workitems/$Task`)

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
    resetTaskSelection()

    const taskCreatingRequests = tasks
      .filter(x => x.isSelected)
      .map(task => {
        const postData = [
          {
            op: "add",
            path: "/fields/System.Title",
            from: null,
            value: task.getTitle(),
          },
          {
            op: "add",
            path: "/relations/-",
            from: null,
            value: {
              rel: "System.LinkTypes.Hierarchy-Reverse",
              url: `${BASE_URL}/wit/workItems/${wiId}`,
            },
          },
        ]
        return postData
      })
      .map(postData =>
        fetch(request, {
          body: JSON.stringify(postData),
        })
      )

    Promise.allSettled(taskCreatingRequests)
      .then(() => {
        // trigger a refresh
        setWorkItemId(null)
        setTimeout(() => {
          setWorkItemId(wiId)
        }, 10)
      })
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
