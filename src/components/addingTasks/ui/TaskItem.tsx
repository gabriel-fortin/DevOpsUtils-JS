"use client"

import { FC, useRef } from "react"

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
    const dialogRef = useRef<HTMLDialogElement>(null)

    const showEditTaskDialog = () => {
      dialogRef.current!.showModal()
    }

    return (
      <>
        <label className="block mt-1">
          {isHttpRequestOngoing ? <Loader /> : <Checkbox />}
          <TaskTitle />
        </label>

        <TaskEditDialog />
      </>
    )

    function Loader() {
      return (<span className="loading loading-ring mr-1"></span>)
    }

    function Checkbox() {
      return (
        <input type="checkbox"
          className="border-2 align-bottom mr-2 checkbox checkbox-sm checkbox-primary checked:checkbox-secondary"
          disabled={!isTaskToggable}
          value={task.getTitle()}
          checked={isTaskChecked}
          onChange={toggleTaskCheckedState}
        />
      )
    }

    function TaskTitle() {
      const cssClass = isTaskEditable ? "link link-secondary" : ""
      return (
        <span onClick={showEditTaskDialog} className={cssClass}>
          {task.getTitle()}
        </span>
      )
    }

    function TaskEditDialog() {

      // TODO: get URL of item in DevOps to make the button navigate to devOps
      const temporaryStaticUrl = "https://google.com"

      return (
        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-3">{task.getTitle()}</h2>
            <p>This task is already added to the current work item</p>

            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-ghost btn-circle absolute right-2 top-2 text-xl">×</button>
              </form>
              <a className="btn btn-info btn-outline" target="_blank" href={temporaryStaticUrl}>
                See in DevOps
                <span className="text-xl">↗</span>
              </a>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button className="bg-transparent border-0">Cancel</button>
          </form>
        </dialog>
      )
    }

  }
