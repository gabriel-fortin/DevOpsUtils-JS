import { useCallback, useEffect, useState } from "react"

import { Task, useAddTaskCall } from "@/dataAccess/addTask"
import { getChildrenIds, useWorkItemCall } from "@/dataAccess/workItem"
import { useMultipleWorkItemsTitlesCall } from "@/dataAccess/workItemsTitles"
import { useProjectUrl } from "@/state/projectUrl"

import { REQUESTED_ADDING_TASKS_TO_WORK_ITEM } from "./constants"


type HookType = (
  _parentWorkItemId: number,
  _task: Task,
  _events: EventTarget,
) => {
  isHttpRequestOngoing: boolean
  isTaskChecked: boolean
  isTaskToggable: boolean
  isTaskEditable: boolean
  toggleTaskCheckedState: () => void
}

export const useTaskItemLogic: HookType =
  (parentWorkItemId, task, events) => {
    const { projectUrl } = useProjectUrl()
    const { trigger: triggerAddTaskCall, isMutating } = useAddTaskCall(parentWorkItemId, task, projectUrl)
    const { titles: alreadyAddedTitles } = useMultipleWorkItemsTitlesCall(
      getChildrenIds(useWorkItemCall(parentWorkItemId).workItemDto))
    const [isSelected, setIsSelected] = useState(false)
    const [isAlreadyAdded, setIsAlreadyAdded] = useState(false)

    const toggleTask = useCallback(() => setIsSelected(x => !x), [])

    const addTaskToDevOps = useCallback(() => {
      // do nothing if task was not selected
      if (!isSelected) return
      if (isAlreadyAdded) return

      triggerAddTaskCall()
        .then(response => {
          if (response.status === 200) {
            setIsAlreadyAdded(true)
            setIsSelected(true)
          }
        })
    }, [isAlreadyAdded, isSelected, triggerAddTaskCall])

    useEffect(() => {
      events.addEventListener(REQUESTED_ADDING_TASKS_TO_WORK_ITEM, addTaskToDevOps)
      return () => {
        events.removeEventListener(REQUESTED_ADDING_TASKS_TO_WORK_ITEM, addTaskToDevOps)
      }
    }, [events, addTaskToDevOps])

    useEffect(() => {
      const hasTaskBeenAlreadyAdded = (alreadyAddedTitles ?? [])
        .some(existing => task.allKnownTitles.some(known => equalIgnoreCase(known, existing)))
      setIsAlreadyAdded(hasTaskBeenAlreadyAdded)
    }, [alreadyAddedTitles, task.allKnownTitles])

    return {
      isHttpRequestOngoing: isMutating,
      isTaskChecked: isSelected || isAlreadyAdded,
      isTaskToggable: !isAlreadyAdded,
      isTaskEditable: isAlreadyAdded,
      toggleTaskCheckedState: toggleTask,
    }
  }

function equalIgnoreCase(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" }) == 0
}