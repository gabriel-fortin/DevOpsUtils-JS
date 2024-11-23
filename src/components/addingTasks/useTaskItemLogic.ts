import { useCallback, useEffect, useState } from "react"

import { Task, useAddTaskCall } from "@/dataAccess/addTask"
import { useWorkItemCall } from "@/dataAccess/workItem"

import { REQUESTED_ADDING_TASKS_TO_WORK_ITEM } from "./constants"


type HookType = (
  _parentWorkItemId: number,
  _task: Task,
  _events: EventTarget,
) => {
  isHttpRequestOngoing: boolean
  isTaskChecked: boolean
  toggleTaskCheckedState: () => void
}

export const useTaskItemLogic: HookType =
  (parentWorkItemId, task, events) => {
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

    return {
      isHttpRequestOngoing: isMutating,
      isTaskChecked: isChecked,
      toggleTaskCheckedState: toggleTask,
    }
  }