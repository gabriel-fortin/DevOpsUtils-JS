import { FC, useMemo, useRef, useState } from "react"

import { Task, createFreshTasksList } from "@/dataAccess/addTask"
import { useWorkItemId } from "@/state/workItemId"

import { REQUESTED_ADDING_TASKS_TO_WORK_ITEM } from "../constants"
import { TasksList } from "./TasksList"


export function AddTasks() {
  const [tasks] = useState<Task[]>(createFreshTasksList)
  const emitter = useMemo(() => new EventTarget(), [])
  const dialogRef = useRef<HTMLDialogElement>(null)

  const specialTasks = tasks.filter(x => x.group === "special")
  const presentationLayerTasks = tasks.filter(x => x.group === "Presentation")
  const accessLayerTasks = tasks.filter(x => x.group === "System Portal")

  return (
    <div className="collapse collapse-arrow collapse-open min-h-0">
      <input type="checkbox" className="min-h-0" />

      <div className="collapse-title text-xl pl-1">
        Add tasks
      </div>

      <div className="collapse-content pb-0 pl-1 -mt-3">
        <SectionName name="Special" />
        <TasksList tasks={specialTasks} events={emitter} />

        <SectionName name="Presentation layer" />
        <TasksList tasks={presentationLayerTasks} events={emitter} />

        <SectionName name="System Portal layer" />
        <TasksList tasks={accessLayerTasks} events={emitter} />

        <div className="flex gap-3">
          <AddTasksButton events={emitter} />
          {/* temporary button to show dialog */}
          <button
            className="btn btn-outline btn-primary mt-4"
            onClick={() => dialogRef.current!.showModal()}
          >
            show edit dialog!
          </button>
        </div>

        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Edit task</h3>
            <p>
              <span>title:</span>
              <span>input with text value</span>
            </p>
            <p>
              <span>group:</span>
              <span>dropdown with group selection</span>
            </p>

            <div className="modal-action">
              <button className="btn btn-success" onClick={() => dialogRef.current!.close()}>
                Add/Update
              </button>
              <button className="btn btn-error" onClick={() => dialogRef.current!.close()}>
                Cancel
              </button>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <div className="bg-transparent border-0">Cancel</div>
          </form>
        </dialog>
      </div>
    </div>
  )
}

const AddTasksButton: FC<{
  events: EventTarget
}> = ({
  events,
}) => {
    const { workItemId } = useWorkItemId()

    const addTasksToWorkItem = () => {
      events.dispatchEvent(new Event(REQUESTED_ADDING_TASKS_TO_WORK_ITEM))
    }

    return (
      <div
        className="btn btn-md btn-primary mt-4"
        onClick={addTasksToWorkItem}
      >
        Add above tasks to #{workItemId}
      </div>
    )
  }

const SectionName: React.FC<{
  name: string
}> = ({
  name,
}) => {
    return (
      <div className="mt-3 font-bold">
        {name}
      </div>
    )
  }
