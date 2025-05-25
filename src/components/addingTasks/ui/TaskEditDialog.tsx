import React, { FC, useImperativeHandle, useRef } from "react"


export type TaskEditDialogActions = {
  showDialog: () => void
}

export const TaskEditDialog: FC<{
  workItemId: number | null
  title: string
  ref: React.RefObject<TaskEditDialogActions>
}> = ({
  workItemId,
  title,
  ref,
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useImperativeHandle(ref, () => {
      return {
        showDialog() {
          dialogRef.current?.showModal()
        }
      }
    }, [])

    if (!workItemId) return null


    // TODO: get URL of item in DevOps to make the button navigate to devOps
    const temporaryStaticUrl = `https://google.com?q=${workItemId}`


    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-bold mb-3">{title}</h2>
          <p>This task is already added to the current work item</p>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-circle absolute right-2 top-2 text-xl" title="Close">
                <span aria-hidden={true}> × </span>
              </button>
            </form>
            <a className="btn btn-info btn-outline" target="_blank" href={temporaryStaticUrl}>
              See in DevOps
              <span className="text-xl">↗</span>
            </a>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button className="bg-transparent border-0">Close</button>
        </form>
      </dialog>
    )
  }
