import { useCallback, useEffect, useState } from "react"

import { Task, useAddTaskCall } from "@/dataAccess/addTask"
import { getChildrenIds, useWorkItemCall, WorkItemDto } from "@/dataAccess/workItem"
import { useWorkItemsBatchCall } from "@/dataAccess/workItemsBatch"
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
  taskId: number | null
  toggleTaskCheckedState: () => void
}

export const useTaskItemLogic: HookType =
  (parentWorkItemId, task, events) => {
    const { projectUrl } = useProjectUrl()
    const { trigger: triggerAddTaskCall, isMutating } = useAddTaskCall(parentWorkItemId, task, projectUrl)
    const { workItemDto} = useWorkItemCall(parentWorkItemId)
    const { workItemsDtos: existingDevOpsTasks } = useWorkItemsBatchCall(getChildrenIds(workItemDto))
    const [isSelected, setIsSelected] = useState(false)
    const [matchingDevOpsTask, setMatchingDevOpsTask] = useState<WorkItemDto | null>(null)

    const toggleTask = useCallback(() => setIsSelected(x => !x), [])

    const addTaskToDevOps = useCallback(() => {
      // do nothing if task was not selected or is already in DevOps
      if (!isSelected) return
      if (matchingDevOpsTask !== null) return

      triggerAddTaskCall()
        .then(response => {
          if (response.status === 200) {
            setIsSelected(true)
          }
        })
    }, [isSelected, matchingDevOpsTask, triggerAddTaskCall])

    useEffect(() => {
      events.addEventListener(REQUESTED_ADDING_TASKS_TO_WORK_ITEM, addTaskToDevOps)
      return () => {
        events.removeEventListener(REQUESTED_ADDING_TASKS_TO_WORK_ITEM, addTaskToDevOps)
      }
    }, [events, addTaskToDevOps])

    useEffect(() => {
      const existingTasksThatMatch = (existingDevOpsTasks ?? [])
        .filter(existingTask => task.allKnownTitles
          .some(title => equalIgnoreCase(title, existingTask.fields["System.Title"])))
      if (existingTasksThatMatch.length > 0) {
        setMatchingDevOpsTask(existingTasksThatMatch[0])
      }
      if (existingTasksThatMatch.length > 1) {
        console.warn(`Multiple matching existing tasks:`, existingTasksThatMatch)
      }
    }, [existingDevOpsTasks, task.allKnownTitles])

    return {
      isHttpRequestOngoing: isMutating,
      isTaskChecked: isSelected || matchingDevOpsTask !== null,
      isTaskToggable: matchingDevOpsTask === null,
      isTaskEditable: matchingDevOpsTask !== null,
      taskId: matchingDevOpsTask ? Number(matchingDevOpsTask.id) : null,
      toggleTaskCheckedState: toggleTask,
    }
  }

function equalIgnoreCase(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" }) == 0
}