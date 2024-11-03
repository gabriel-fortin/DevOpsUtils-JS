"use client"

import { CSSProperties, FC, useCallback, useEffect, useState } from "react"

import { useFetchWorkItem } from "@/showWorkItems/hooks"

import { useAddTaskToWorkItem } from "../hooks"
import { Task } from "../task"
import { REQUESTED_ADDING_TASKS_TO_WORK_ITEM } from "./AddTasks"
import styles from "./AddTasks.module.css"


export const TaskItem: FC<{
  parentWorkItemId: number
  task: Task
  events: EventTarget
}> = ({
  parentWorkItemId,
  task,
  events,
}) => {
    const { trigger: triggerAddingTask, isMutating } = useAddTaskToWorkItem(parentWorkItemId, task)
    // by adding a child task, we're effectively modifying the parent
    // so we need a way to refresh its data
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
      events.addEventListener(REQUESTED_ADDING_TASKS_TO_WORK_ITEM, addTaskToDevOps)
      return () => {
        events.removeEventListener(REQUESTED_ADDING_TASKS_TO_WORK_ITEM, addTaskToDevOps)
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
