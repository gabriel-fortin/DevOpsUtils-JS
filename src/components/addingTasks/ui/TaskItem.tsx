"use client"

import React, { FC, useImperativeHandle, useRef } from "react"

import { Task } from "@/dataAccess/addTask"

import { useTaskItemLogic } from "../useTaskItemLogic"
import { TaskEditDialog, TaskEditDialogActions } from "./TaskEditDialog"


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
      taskId,
      toggleTaskCheckedState,
    } = useTaskItemLogic(parentWorkItemId, task, events)

    const taskEditDialogRef = useRef<TaskEditDialogActions>(null)

    return (
      <>
        <label className="block mt-1">
          {isHttpRequestOngoing
            ? <Loader />
            : <Checkbox isToggable={isTaskToggable} isChecked={isTaskChecked} onChange={toggleTaskCheckedState} />
          }
          <TaskTitle
            isTaskEditable={isTaskEditable}
            title={task.getTitle()}
            onClick={taskEditDialogRef.current?.showDialog} />
        </label>

        <TaskEditDialog workItemId={taskId} title={task.getTitle()} ref={taskEditDialogRef} />
      </>
    )
  }


function Loader() {
  return (<span className="loading loading-ring mr-1"></span>)
}

const Checkbox: FC<{
  isToggable: boolean,
  isChecked: boolean,
  onChange: () => void
}> = ({
  isToggable,
  isChecked,
  onChange,
}) => {
    return (
      <input type="checkbox"
        className="border-2 align-bottom mr-2 checkbox checkbox-sm checkbox-primary checked:checkbox-secondary"
        disabled={!isToggable}
        checked={isChecked}
        onChange={onChange}
      />
    )
  }

const TaskTitle: FC<{
  isTaskEditable: boolean,
  title: string,
  onClick: (() => void) | undefined
}> = ({
  isTaskEditable,
  title,
  onClick,
}) => {
    const cssClass = isTaskEditable ? "link link-secondary" : ""
    return (
      <span onClick={onClick} className={cssClass}>
        {title}
      </span>
    )
  }
  