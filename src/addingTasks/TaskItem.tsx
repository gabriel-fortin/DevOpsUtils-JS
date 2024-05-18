"use client"

import EventEmitter from "events"
import React, { CSSProperties, FC, useCallback, useEffect, useState } from "react"

import { useAddTaskToWorkItem, useFetchWorkItem } from "@/repository/swr"

import { Task } from "./tasks"
import { REQUESTED_ADDING_TASKS_TO_WORK_ITEM } from "./AddTasks"
import styles from "./AddTasks.module.css"


export const TaskItem: FC<{
  parentWorkItemId: number
  task: Task
  events: EventEmitter
}> = ({
  parentWorkItemId,
  task,
  events,
}) => {
    const { trigger: triggerAddingTask, isMutating } = useAddTaskToWorkItem(parentWorkItemId, task)
    // effectively, we're modifying the parent as well so we need a way to make it refresh
    const { mutate: refreshParent } = useFetchWorkItem(parentWorkItemId)
    const [isChecked, setIsChecked] = useState(false)

    const toggleTask = useCallback(() => setIsChecked(x => !x), [])

    const addTaskToDevOps = useCallback(() => {
      // do nothing is task was not selected
      if (!isChecked) return

      triggerAddingTask()
        .then(response => {
          if (response.status === 200) {
            setIsChecked(false)
            refreshParent()
          }
        })
    }, [isChecked, refreshParent, triggerAddingTask])

    useEffect(() => {
      events.on(REQUESTED_ADDING_TASKS_TO_WORK_ITEM, addTaskToDevOps)
      return () => {
        events.off(REQUESTED_ADDING_TASKS_TO_WORK_ITEM, addTaskToDevOps)
      }
    }, [events, addTaskToDevOps])

    return (
      <TaskItemUi
        isHttpRequestOngoing={isMutating}
        task={{ ...task, isChecked }}
        toggleChecked={toggleTask}
      />
    )
  }

const TaskItemUi: FC<{
  isHttpRequestOngoing: boolean
  task: Task & { isChecked: boolean }
  toggleChecked: () => void
}> = ({
  isHttpRequestOngoing,
  task,
  toggleChecked,
}) => {
    const labelStyle: CSSProperties = { display: "block", marginTop: "0.1em" }
    const checkboxStyle: CSSProperties = { marginRight: "0.5em" }
    const progressStyle: CSSProperties = {
      margin: "0 0.78em 0 0.25em",
      transform: "none", // cancel a transform that is defined in the global style
    }

    return (
      <label style={labelStyle}>
        {isHttpRequestOngoing
          ? <span style={progressStyle} className={styles.spinAnimation}>I</span>
          :
          <input type="checkbox"
            value={task.name}
            checked={task.isChecked}
            onChange={toggleChecked}
            style={checkboxStyle} />}
        {task.getTitle()}
      </label>
    )
  }
