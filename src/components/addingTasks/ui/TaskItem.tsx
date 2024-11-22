"use client"

import { FC, useCallback, useEffect, useState } from "react"

import { Task, useAddTaskCall } from "@/dataAccess/addTask"
import { useWorkItemCall } from "@/dataAccess/workItem"

import { REQUESTED_ADDING_TASKS_TO_WORK_ITEM } from "./AddTasks"


export const TaskItem: FC<{
  parentWorkItemId: number
  task: Task
  events: EventTarget
  //TODO: isAlreadyInDevOps: boolean
}> = ({
  parentWorkItemId,
  task,
  events,
  // TODO: isAlreadyInDevOps,
}) => {
    const { trigger: triggerAddingTask, isMutating } = useAddTaskCall(parentWorkItemId, task)
    // by adding a child task, we're effectively modifying the parent
    // so we need a way to refresh its data
    const { mutate: refreshParent } = useWorkItemCall(parentWorkItemId)
    const [isChecked, setIsChecked] = useState(false)

    const toggleTask = useCallback(() => setIsChecked(x => !x), [])

    const addTaskToDevOps = useCallback(() => {
      // do nothing if task was not selected
      if (!isChecked) return

      triggerAddingTask()
        .then(response => {
          if (response.status === 200) {
            setIsChecked(false)
            refreshParent()
            // TODO: show toast
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
    return (
      <label className="block mt-1">
        {isHttpRequestOngoing
          ? <span className="loading loading-ring mr-1">.</span>
          :
          <input type="checkbox"
            className="border-2 align-bottom mr-2 checkbox checkbox-sm checkbox-primary checked:checkbox-secondary"
            value={task.name}
            checked={task.isChecked}
            onChange={toggleChecked}
          />
        }
        <span className="">
          {task.getTitle()}
        </span>
      </label>
    )
  }
