"use client"

import { FC } from "react"

import { Task } from "@/dataAccess/addTask"

import { useTaskItemLogic } from "../useTaskItemLogic"


export const TaskItem: FC<{
  parentWorkItemId: number
  task: Task
  events: EventTarget
}> = ({
  parentWorkItemId,
  task,
  events,
}) => {
    const {
      isHttpRequestOngoing,
      isTaskChecked,
      toggleTaskCheckedState,
    } = useTaskItemLogic(parentWorkItemId, task, events)

    return (
      <label className="block mt-1">
        {isHttpRequestOngoing
          ? <span className="loading loading-ring mr-1">.</span>
          :
          <input type="checkbox"
            className="border-2 align-bottom mr-2 checkbox checkbox-sm checkbox-primary checked:checkbox-secondary"
            value={task.name}
            checked={isTaskChecked}
            onChange={toggleTaskCheckedState}
          />
        }
        <span className="">
          {task.getTitle()}
        </span>
      </label>
    )
  }
