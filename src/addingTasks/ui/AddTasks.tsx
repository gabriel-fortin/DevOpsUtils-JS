"use client"

import EventEmitter from "events"
import React, { CSSProperties, FC, useMemo, useState } from "react"

import { useWorkItemIdValue } from "@/contexts/WorkItemIdContext"

import { Task, createFreshTasksList } from "../task"
import { TasksList } from "./TasksList"


export const REQUESTED_ADDING_TASKS_TO_WORK_ITEM = "requested adding tasks to work item"

export function AddTasks() {
  const [tasks] = useState<Task[]>(createFreshTasksList)

  const emitter = useMemo(() => new EventEmitter(), [])
  emitter.setMaxListeners(tasks.length)

  const specialTasks = tasks.filter(x => x.group === "special")
  const presentationLayerTasks = tasks.filter(x => x.group === "Presentation")
  const accessLayerTasks = tasks.filter(x => x.group === "Access")

  return (
    <details>
      <Header />
      <TasksList tasks={specialTasks} events={emitter} />
      <Separator />
      <TasksList tasks={presentationLayerTasks} events={emitter} />
      <Separator />
      <TasksList tasks={accessLayerTasks} events={emitter} />
      <Button events={emitter} />
    </details>
  )
}

const Button: FC<{
  events: EventEmitter
}> = ({
  events,
}) => {
    const workItemId = useWorkItemIdValue()

    const addTasksToWorkItem = () => {
      events.emit(REQUESTED_ADDING_TASKS_TO_WORK_ITEM)
    }

    const buttonStyle: CSSProperties = { marginTop: "1em" }

    return (
      <button onClick={addTasksToWorkItem} style={buttonStyle}>
        Add above tasks to #{workItemId}
      </button>
    )
  }

function Separator() {
  const separatorStyle: CSSProperties = { margin: "0.7em" }
  return (<div style={separatorStyle} />)
}

function Header() {
  const summaryStyle: CSSProperties = { display: "block" }
  const headerStyle: CSSProperties = { display: "list-item" }

  return (
    <summary style={summaryStyle}>
      <h2 style={headerStyle}>
        Add tasks
      </h2>
    </summary>
  )
}
