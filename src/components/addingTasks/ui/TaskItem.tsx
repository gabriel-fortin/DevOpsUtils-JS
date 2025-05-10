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
      isTaskToggable,
      isTaskEditable,
      toggleTaskCheckedState,
    } = useTaskItemLogic(parentWorkItemId, task, events)

    const editTask = () => {
      alert('TODO: task edit dialog')
    }

    return (
      <label className="block mt-1">
        {isHttpRequestOngoing
          ? <span className="loading loading-ring mr-1">.</span>
          :
          <input type="checkbox"
            className="border-2 align-bottom mr-2 checkbox checkbox-sm checkbox-primary checked:checkbox-secondary"
            disabled={!isTaskToggable}
            value={task.getTitle()}
            checked={isTaskChecked}
            onChange={toggleTaskCheckedState}
          />
        }
        <span onClick={editTask}
         className={isTaskEditable ? "link link-secondary" : ""}
        >
          {task.getTitle()}
        </span>
      </label>
    )
  }
